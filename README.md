# Must-know

## In order to acces the Admin page, enter [email: admin, password: admin] at the login page. In real life scenarios of course these admin roles are pre-set or given by the backend or other administrators later. Here the admin user is already created for demo purposes.

## To start the project;
1. npm i,
2. npm run mockdb,
3. ng serve

## Documentation | The Beerstore

## General

This project is a mock-webshop, built between April 2023 - May 2023 for Danubius Zrt. Created by Benjamin Kovács.
Tha main funcionalities are the following: Upon installation you arrive to the Landing page, which is the Home of the website.
If you visit the page for the first time, you will be asked to accept the cookie consent (cookie-consent component) before moving forward.
On the top of the screen you can use the Navbar (Header component) to navigate between the pages, login, register or to view your shopping cart. 
On the Products page you can view to products, their description, you can filter them by certain categories or by price. If you are a registered user, you can add the items to your basket. In the cart component, you may modify your order before going to the checkout. In the checkout (once you reviewed your order) you can click to "order" and your products will be forwarded to the mock-backend. If you have
administrator role (already provided user) you can see an extra option in the Navbar where you can head to the Admin page. Here, you can view all products in a table. You can modify, delete or add new product.

# File structure

    - models

    Contains the typescript interfaces used in the application.

    - styles

    Contains the SCSS functions, mixins and colors used in the application.

    - core 

    Contains the authentication related services and interceptors.

    - shared

    Contains the loader component, which may be used in each component if needed.

    - environments

    Contains the mockbackend url.

    - App

    The main module is the App module. The app module uses Lazy-load to display the router-outlet to the DOM. In the html besides the outlet, you can see that the Header component and cookie consent is present as well, thus making them to be always in the view.

    - Product List 

    The most complex module. It has relations to the array of products from the backend, the individual items component, the shopping cart component and the checkout component.

    Product-list >> Product-item | communicates through Input(), Output(), EventEmitters.
    Product-list >> other | communicates through Services and data saved in session storage.

    In the product list you can filter the elements through various methods (done in the Product List service) and in NgOnInit, the basic options for filter is set up from the available categories on the server.

    Product List uses Angular Animations to create a better user experience when purchusing an item.

    - Product-item

    Mostly for the visual apperance of the product items. If the user is logged in an EventEmitter might be activated by click, forwarding the selected item's id to the products list. When the products' list gets the Id, it seaches for the product using the Product List Service. 

    - Shopping Cart 

    To activate the shopping cart, you can use the shopping-cart-icon located in the Navbar. You can also see a number at the right-upper corner of the icon.The number uses Behavior Subject and async pipe to display the number of products in your cart. If you are inside the component, you can view your items, add or remove from them. You may also view the total bill of your order.

    - Checkout

    In the checkout component (beside of your items and the total bill) you can see your billing data which you have provided when registered. Once you click on 'order', your order will be forwarded and saved to the backendServer. (to mimic real life scenarios, only the products' ID and amount is relevant)

    - Product Detail

    The main purpose of the component is to display almost all information about the product. This is one by using query params, and getting the ID from the url. Also a number of products will be sorted from all products - to present a 'similar products' page (based on mainCategory). You can even jump to one of these products by clicking at them.

    - Login Component

    A simple form validation which forwards the credentials to the AuthService and the backend. Here, the updateUsername() method is called. Username$ is a behavior subject which is displayed in the header in an async (via subscription) way. The message "Hello user" is displayed one you log in. 

    - Registration Component

    A complex form which checks for multiple validations and forwards the registration data to the Auth Service if the registration form is valid.

    - Header component

    Most of the content is for navigation and @media adjusting. Header component has two vital states - logged in | logged out. Since the header is always at the top of the website, it updates via subscriptions to username$ (for displaying the username) and isLoggedIn$ (for showing Logout button) subjects. This way there is no need for manual refresh of the page to update the header. Also here happens the restorePrevState() function, which makes sure that the cart items number (the little red number on the shopping cart icon) doesn't delete if you refresh the page. The other factors (username$ isLoggedIn$ is eventually stored in tokens, so they won't be affected)

    - Admin component

    In the Admin component you can view all potential products in a table. You can search through them (simalar to Products List), add new item via service (POST), modify item (PUT) or delete item (DELETE). Admin component uses 2 sets of forms, validates them through different methods and capitalize the values automatically to make sure consistant experience.

# Services & logic

    - ProductListService

    # getAllProducts() - returns the map of all products from the server.
    # getProductById() - returns a certain product by id from all products.
    # getSuggestedProducts() - returns a list of products with the same category as the argument. (used in productDetail comp.)
    # getCostFilter() - returns a sorted array of the displayed products list. (works at all conditions)
    # getAdvancedFilter() - returns a filtered products list by the advanced criteria. (if no criteria is provided, it automatically switches back to the original whole list)
    # getSearchedElements() - returns the elements which includes the argument. (returns all possible results regardless if the advanced option was used before)
    # addProductToCart() - saves the specified product and its amount in sessionStorage and updates the cartAmount visible in the navbar.

    - ShoppingCartService

    # sumAmount - sumAmount is responsible for updating the number of products in the navbar. This is done through BehaviorSubject and .next() method. Whenever the total amount of products is manipulated by the user, the .next() method is called to update the value. 
           ## restorePrevState() - responsible to update the sumAmount in the header if the website is refreshed.
    # amountDeterminator() - called when new product is added to the cart in the Products List Component [service: addProductToCart()] to update the sumAmount.
    # clearAmount() - clears the shopping cart on logout.
    # getShoppingItems() - returns the shopping cart items.
    # decreaseAmount() - checks wheter the item's amount is greater than 1. If greater, it simply decreases the amount prop as normally. It it happens to be 1, than the item must be deletet from the array if decreased. It also checks wheter this item is at position 0 or not. If 0, is uses shift() to delete it, if no it uses splice() and concat(). Also updates the number in the navbar by calling amountDeterminator().
    # increaseAmount() - adds 1 to the amount of the item, and updates the number in the navbar by calling amountDeterminator().
    # getTotalBill() - iterates through the items in the session to determin the sum of their prices.
    # restorePrevState() - used in the navbar to keep track of cart items' number.

    - AuthService

    # saveCoookieConsent() - saves in localstorage if user accepted cookies.
    # registration() - makes a post request to the mockbackend with the credentials the user registered. (all of these credentials will be stored in a token - except for the password)
            # getUserData() - gets the user data from the token (as mentioned, except the password)
    # login() - forwads the login request to the backend.
    # checkLogin() - returns a boolean whether the user is logged in or not.
    # logout() - deletes the user's token and reset all the nececcary actions done by the user **.
    # checkAdmin() - returns a boolean on if the user is admin or not.
    # onPlaceOrder() - called in the checkout component when user wants to send their order to the backend. This method attempts to post the to the backend.

    # usernameSubject - BehaviorSubject which displays the user's username in the navbar. The observable made from it is the username$. When the user logs in the handleLogin() method updates the username by the token's username. the username$ is listened to by the navbar to display the username. Also in the authService constructor, there is a token check defined. The reason is to ensure that the username won't dissapear in the navbar even after refreshing the page.

    # logValueHeaderSubject - Another BehaviorSubject, which is a boolean to keeptrack wether the user is logged in or not. If logged in tha navbar displays the logout button, if not then the login button. The updateHeader (.next()) is called when the user logs in succesfully, updating the header. The isLoggedIn$ is listened by the header (similar to username) to ensure that the value stays after refresh.

    - AdminService 

    # Mostly http post requests to the server to add items or modify them. Though the admin component looks more complex, in reality its mostly just form validation and adjustment (capitalizing the first letter always for ex.) 

# Guards

    # AdminGuard - restricts the route for only admins.
    # LoginGuard - restricts the route for only users not logged in (to protect double token generating).
    # ShoppingCartGuard - restricts the route for only logged in users.

# Miscellaneous

    # the website uses SCSS and certain SCSS functions, mixins, etc. (located in styles folder). [and tries to applly the BEM, well..maybe not perfectly]
    # there is one sample of Angular Animations located in Product list and displayed when user adds a new product.
    # in the Product Item comp. [ngClass] is used to display dynamically the classes affected by (Novelty or Discounted banner)
    # in the header html Ng-container and ng-template is used to separate the log status [for experimental reasons]

# Bugs & ideas

    # **In rare cases (only God knows why) the token is not deleted when the logout is hit. This happens only very rare cases and not entirely known why.
    # In the future, a profile site might be added, where people could modify their registered adress options.
    # For the admins, a page where they could see the selt items' analytics may be useful.
    # Option for saving items for future purchase.
    # During the project it is assumed that the necessary images are stored in a seperate cloud on the internet, accessable by url (imgURL), maybe a method to upload pictures from file if necessary.

