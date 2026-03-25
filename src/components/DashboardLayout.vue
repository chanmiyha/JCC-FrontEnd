<template>
    <div class="dashboard">
        <v-app-bar class="navbar" fixed app color="#F2E3D5">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> 
            <VSpacer /><VSpacer />
            <router-link to="/">
                <img height="50" width="120" src="../assets/image.png"/>
            </router-link>
            <v-btn @click="logout" class="logout-btn" color="F2E3D5" text size="large">
                <v-icon left size="28px">mdi-power</v-icon>
            </v-btn>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" class="drawer" width="256" app color="#0000" location="right">
            <span v-if="departemen == 'Admin'">
                <v-list dense nav>
                    <v-list-item
                        v-for="item in itemsAdmin"
                        :key="item.title"
                        link
                        tag="router-link" 
                        :to="item.to"       
                    >
                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </span>

            <span v-else-if="departemen == 'Owner'">
                <v-list dense nav>
                    <v-list-item
                        v-for="item in itemsOwner"
                        :key="item.title"
                        link
                        tag="router-link" 
                        :to="item.to"       
                    >
                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </span>

            <span v-if="departemen == 'Marketing'">
                <v-list dense nav>
                    <v-list-item
                        v-for="item in itemsMarketing"
                        :key="item.title"
                        link
                        tag="router-link" 
                        :to="item.to"       
                    >
                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </span>
            
            <span v-if="departemen == 'Produksi'">
                <v-list dense nav>
                    <v-list-item
                        v-for="item in itemsProduksi"
                        :key="item.title"
                        link
                        tag="router-link" 
                        :to="item.to"       
                    >
                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </span>    


        </v-navigation-drawer>

        <div class="grey lighten-4 fullheight pa-5">
            <router-view></router-view>
        </div>

        <v-footer flat color="#F2E3D5">
            <v-col class="text-center mt-4" cols="12">
                {{ new Date().getFullYear() }} — <strong>The Java Creacraft</strong>
            </v-col>
        </v-footer>
    </div>
</template>

<script>
export default 
{
    name: "Dashboard",

    watch: {
      $route: {
        immediate: true,

        handler() {
          document.title = "Dashboard";
        },
      },
    },

    data()
    {
        return {
            drawer: false,
            departemen: localStorage.getItem("departemen"),
            /*items:
            [
                { title: "Home", to: "/" },
                { title: "Barang", to: "/barang"},
                { title: "Supplier", to: "/suppliers"},
                { title: "Harga Supplier", to: "/hpp"},
                { title: "PO", to: "/po"},
                { title: "Stok", to: "/stok"},
                { title: "Pegawai", to: "/pegawai"},
                { title: "Kategori", to: "/kategori"},
                { title: "Buyer", to: "/buyer"},
                { title: "Detail PO", to: "/detailpo"},
                { title: "Departemen", to: "/departemen"},
                { title: "PO Supplier", to: "/posupplier"},
            ],*/
            itemsAdmin:
            [
                { title: "Home", to: "/" },
                { title: "HPP", to: "/hpp"},
                { title: "PO", to: "/po"},
                { title: "Stok", to: "/stok"},
                { title: "Pegawai", to: "/pegawai"},
                { title: "Departemen", to: "/departemen"},
                { title: "PO Supplier", to: "/posupplier"},
            ],
            itemsMarketing:
            [
                { title: "Home", to: "/" },
                { title: "Barang", to: "/barang"},
                { title: "PO", to: "/po"},
                { title: "Kategori", to: "/kategori"},
                { title: "Buyer", to: "/buyer"},
                { title: "Detail PO", to: "/detailpo"},
            ],
            itemsProduksi:
            [
                { title: "Home", to: "/" },
                { title: "Supplier", to: "/suppliers"},
                { title: "Harga Supplier", to: "/hpp"},
                { title: "Stok", to: "/stok"},
            ],
            itemsOwner:
            [
                { title: "Home", to: "/" },
                { title: "PO Buyer", to: "/pobuyerpage"},
                { title: "Stok", to: "/stokpage"},
                { title: "PO Supplier", to: "/posupplierpage"},
            ],
        };
    },

    methods: 
    {
        logout() 
        {
            localStorage.removeItem("loggedIn");
            localStorage.removeItem("departemen");
            this.$router.push({ name: "LoginPage" });
        },
    },
};
</script>

<style scoped>
    .fullheight
    {
        min-height: 100vh !important;
    }

    .drawer 
    {
        flex-grow: 1;
        height: calc(100% - 64px); 
    }
</style>
