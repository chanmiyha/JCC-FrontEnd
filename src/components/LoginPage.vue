<template>
    <main>
        <v-container fluid pa-0 fill-height>
            <v-row 
                align="center" justify="center"
                style="height: 100vh; background: #196b4d; margin: 0"
            >
                <v-col 
                    cols="12" lg="6" md="6" 
                    class="left-login white fill-height d-flex flex-column justify-center align-center"
                >
                    <h2 style="font-weight: bold; margin-top:6.5%">PT THE JAVA CREACRAFT</h2>
                    <h5>The Java Creacraft, is a group of people who really understand the meaning of art, the process of making, the process of sending and trading art products.</h5>
                </v-col>

                <v-col 
                    cols="12" lg="10" md="10"
                    style="background: #F2E3D5;"
                    class="right-login fill-height d-flex flex-column justify-center align-center"
                >
                    <v-card width="380" height="480">
                        <v-form ref="form" lazy-validation @submit.prevent="login">
                            <v-card-text max-width="150" max-height="100" style="padding: 20%">
                                <v-row>
                                    <v-col cols="8" />
                                    <v-col cols="10" style="padding: 0">
                                        <img contain height="80" width="120" src="../assets/image.png" style="margin-left: 5%;"/>
                                    </v-col>
                                </v-row>

                                 <v-select
                                    v-model="departemen"
                                    label="Departemen"
                                    :rules="deptRules"
                                    :items="['Admin', 'Marketing', 'Produksi', 'Owner']"
                                    required
                                ></v-select>
                                    
                                <v-text-field
                                    counter
                                    required
                                    label="Password"
                                    v-model="password"
                                    :rules="passwordRules"
                                    :type="showPassword ? 'text' : 'password'"
                                    @click:append="showPassword = !showPassword"
                                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    @keydown.enter="login"
                                />
                            </v-card-text>

                            <v-card-actions style="padding: 0% 8% 8% 8%">
                                <v-btn
                                    depressed
                                    @click="login"
                                    class="blue white--text justify-center align-center"
                                    style="width: 100%; font-size: 90%; border: 10%; border-radius: 10px; font-weight: 4%; font-family: Calibri;"
                                >
                                    Masuk
                                </v-btn>
                            </v-card-actions>
                        </v-form>

                        <v-overlay :value="overlay">
                            <v-progress-circular indeterminate size="64" />
                        </v-overlay>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
    </main>
</template>

<script>
    export default {
        name: "LoginPage",

        watch: {
            $route: {
                immediate: true,

                handler() {
                    document.title = "Login";
                },
            },
        },

        data() {
            return {
                color: "",
                departemen: "",
                password: "",
                overlay: false,
                snackbar: false,
                error_message: "",
                showPassword: false,
                passwordRules: [(v) => !!v || "Password Wajib Dimasukkan"],
                deptRules: [
                    (v) => !!v || "Departemen Wajib Dimasukkan",
                ],
            }
        },

        methods: 
        {
            login() 
            {
                const users = {
                    Admin: "admin",
                    Marketing: "marketing",
                    Produksi: "produksi",
                    Owner: "owner",
                };
                if (this.departemen && this.password) {
                if (users[this.departemen] === this.password) 
                {
                    this.color = "green";
                    this.snackbar = true;
                    this.error_message = "Login Successful!";
                    localStorage.setItem("loggedIn", true); 
                    localStorage.setItem("departemen", this.departemen);
                    this.$router.push({ name: "Dashboard" }); 
                } else 
                {
                    this.color = "red";
                    this.snackbar = true;
                    this.error_message = "Invalid Credentials!";
                }
            } else {
                this.color = "red";
                this.snackbar = true;
                this.error_message = "Please fill in all the fields!";
            }
        },
           
        }
    }
</script>

<style>
    .container {
        height: 100%;
    }

    * {
        box-sizing: border-box;
    }

    .left-login{
        display: flex;
    }

    .right-login{
        flex: 1;
        position: relative;
    }

    .theme--light.v-application {
        background: rgba(248,249,253,255);
    }

    .v-application .blue {
        background-color: #366abf!important;
        border-color: #4cb5f9!important;
    }

    .v-application{
        display: block;
    }

    .v-btn {
        letter-spacing: 0;
        font-weight: 550;
    }

    .v-text-field label {
        font-size: 80%;
    }

    .v-text-field input {
        font-size: 80%;
    }

    .v-responsive {
        flex: none;
    }

    [class*="col-"] {
        float: left;
        padding: 15px;
    }

    /* For mobile phones: */
    [class*="col-"] {
        width: 100%;
    }

    @media only screen and (min-width: 600px) {
        /* For tablets: */
        .col-s-1 {width: 8.33%;}
        .col-s-2 {width: 16.66%;}
        .col-s-3 {width: 25%;}
        .col-s-4 {width: 33.33%;}
        .col-s-5 {width: 41.66%;}
        .col-s-6 {width: 50%;}
        .col-s-7 {width: 58.33%;}
        .col-s-8 {width: 66.66%;}
        .col-s-9 {width: 75%;}
        .col-s-10 {width: 83.33%;}
        .col-s-11 {width: 91.66%;}
        .col-s-12 {width: 100%;}
    }

    @media only screen and (min-width: 768px) {
        /* For desktop: */
        .col-1 {width: 8.33%;}
        .col-2 {width: 16.66%;}
        .col-3 {width: 25%;}
        .col-4 {width: 33.33%;}
        .col-5 {width: 41.66%;}
        .col-6 {width: 50%;}
        .col-7 {width: 58.33%;}
        .col-8 {width: 66.66%;}
        .col-9 {width: 75%;}
        .col-10 {width: 83.33%;}
        .col-11 {width: 91.66%;}
        .col-12 {width: 100%;}
    }
    
    .v-input--radio-group__input {
        width: 77.7%;
    }
</style>