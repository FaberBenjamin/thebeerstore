import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AdminComponent } from "./admin.component";
import { AdminGuard } from "./admin.guard";

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        canActivate: [AdminGuard]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminRoutingModule {}