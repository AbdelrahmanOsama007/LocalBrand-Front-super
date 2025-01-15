import { Routes } from '@angular/router';
import { HomeComponent } from './core/components/user/home/home.component';
import { ProductDetailsComponent } from './core/components/user/product-details/product-details.component';
import { MainCartComponent } from './core/components/user/main-cart/main-cart.component';
import { ProductsComponent } from './core/components/user/products/products.component';
import { ContactUsComponent } from './core/components/user/contact-us/contact-us.component';
import { MainWishlistComponent } from './core/components/user/main-wishlist/main-wishlist.component';
import { CheckOutComponent } from './core/components/user/check-out/check-out.component';
import { AdminDashBoardComponent } from './core/components/admin2/admin-dash-board/admin-dash-board.component';
import { AdminHomeComponent } from './core/components/admin2/admin-home/admin-home.component';
import { ProductscrudComponent } from './core/components/admin2/productscrud/productscrud.component';
import { OrderCrudComponent } from './core/components/admin2/order-crud/order-crud.component';
import { CatcrudComponent } from './core/components/admin2/catcrud/catcrud.component';
import { ErrorComponent } from './core/components/general/error/error.component';
import { LoginComponent } from './core/components/admin/login/login.component';
import { ChangePasswordComponent } from './core/components/admin/change-password/change-password.component';
import { ForgetPasswordComponent } from './core/components/admin/forget-password/forget-password.component';
import { SearchComponent } from './core/components/user/search/search.component';
import { authCheckoutGuard } from './core/guards/auth-checkout.guard';
import { authAdminGuard } from './core/guards/auth-admin.guard';
import { SaleProductsComponent } from './core/components/user/sale-products/sale-products.component';
import { EmailsComponent } from './core/components/admin/emails/emails.component';
import { DeliveredProductsComponent } from './core/components/admin2/delivered-products/delivered-products.component';
import { ProcessingProductsComponent } from './core/components/admin2/processing-products/processing-products.component';
import { ColorsComponent } from './core/components/admin/colors/colors.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'productdetails/:id', component: ProductDetailsComponent},
    { path: 'cart', component: MainCartComponent},
    { path: 'products/:id', component: ProductsComponent},
    { path: 'contact-us', component: ContactUsComponent},
    { path: 'wishlist', component: MainWishlistComponent},
    { path: 'check-out', component: CheckOutComponent, canActivate: [authCheckoutGuard]},
    { path: 'error', component: ErrorComponent},
    { path: 'admin-login/ahmedeltalkhawy/550e8400-e29b-41d4-a716-446655440000', component: LoginComponent},
    { path: 'search', component:SearchComponent},
    { path: 'sale', component:SaleProductsComponent},
    { path: 'change-admin-password', component: ChangePasswordComponent, canActivate: [authAdminGuard]},
    { path: 'forget-password', component: ForgetPasswordComponent},
    { path: 'admin', component: AdminDashBoardComponent, canActivate: [authAdminGuard]},
    { path: 'admin/home', component: AdminHomeComponent, canActivate: [authAdminGuard]},
    { path: 'canceledorder', component: OrderCrudComponent, canActivate: [authAdminGuard]},
    { path: 'productcrud', component: ProductscrudComponent, canActivate: [authAdminGuard]},
    { path: 'delorder', component: DeliveredProductsComponent, canActivate: [authAdminGuard]},
    { path: 'processingorder', component: ProcessingProductsComponent, canActivate: [authAdminGuard]},
    { path: 'catcrud', component: CatcrudComponent, canActivate: [authAdminGuard]},
    { path: 'emailcrud', component: EmailsComponent, canActivate: [authAdminGuard]},
    { path: 'colorcrud', component: ColorsComponent, canActivate: [authAdminGuard]},
    { path: '**', redirectTo: 'home' },
];