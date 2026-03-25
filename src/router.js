import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

function importComponent(path)
{
    return () => import(`./components/${path}.vue`);
}

const router =  new VueRouter
({
    mode: "history",
    routes: 
    [
        {
            path: "/login",
            name: "LoginPage",
            meta: { title: "LoginPage" },
            component: importComponent("LoginPage"),
        },
        
        {
            path: "/",
            component: importComponent("DashboardLayout"),
            children:
            [
                {
                    path: "/",
                    name: "Dashboard",
                    component: importComponent("Dashboard"),
                },

                {
                    path: "/barang",
                    name: "Barang",
                    component: importComponent("Data Master/Barang"),
                },

                {
                    path: "/suppliers",
                    name: "Supplier",
                    component: importComponent("Data Master/Suppliers"),
                },

                {
                    path: "/hpp",
                    name: "HPP",
                    component: importComponent("Data Master/HPP"),
                },

                {
                    path: "/po",
                    name: "PO",
                    component: importComponent("Data Master/PO"),
                },

                {
                    path: "/stok",
                    name: "Stok",
                    component: importComponent("Data Master/Stok"),
                },

                {
                    path: "/pegawai",
                    name: "Pegawai",
                    component: importComponent("Data Master/Pegawai"),
                },

                {
                    path: "/kategori",
                    name: "Kategori",
                    component: importComponent("Data Master/Kategori"),
                },

                {   
                    path: "/buyer",
                    name: "Buyer",
                    component: importComponent("Data Master/Buyer"),
                },

                {
                    path: "/detailpo",
                    name: "Detail PO",
                    component: importComponent("Data Master/DetailPO"),
                },

                {
                    path: "/departemen",
                    name: "Departemen",
                    component: importComponent("Data Master/Departemen"),
                },

                {
                    path: "/posupplier",
                    name: "PO Supplier",
                    component: importComponent("Data Master/POSupplier"),
                },

                {
                    path: "/posupplierpage",
                    name: "PO Supplier",
                    component: importComponent("Dokumen/POSupplierPage"),
                },

                {
                    path: "/pobuyerpage",
                    name: "PO",
                    component: importComponent("Dokumen/POBuyerPage"),
                },

                {
                    path: "/stokpage",
                    name: "Stok",
                    component: importComponent("Dokumen/StokPage"),
                },

            ],
        },
    ],
});

export default router;