<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5">DATA PEGAWAI</h3>
        <v-card>
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog = true">Tambah</v-btn>
            </v-card-title>

            <v-data-table
                :headers="headers"
                :items="pegawais"
                :search="search"
            >
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon color="green" @click="editItem(item)"> mdi-pencil </v-icon>
                    <v-icon color="red" @click="deleteItem(item)"> mdi-delete </v-icon>
                    <v-icon @click="detailItem(item)"> mdi-chevron-right </v-icon>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Form Pegawai</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        
                        <v-select
                            v-model="formPgw.id_departemen"
                            label="Departemen"
                            :rules="dptRules"
                            item-text="nama_departemen"
                            item-value="id_departemen"
                            :items="departemen"
                            required
                        />

                        <v-text-field
                            v-model="formPgw.nama_pegawai"
                            label="Nama Pegawai"
                            :rules="namaRules"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="formPgw.nik"
                            label="NIK"
                            :rules="nikRules"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="formPgw.email_pgw"
                            label="Email Pegawai"
                            hint="example@jcc-yogya.com"
                            :rules="emailRules"
                        ></v-text-field>

                        <v-text-field
                            v-model="formPgw.telp_pgw"
                            label="Nomor Telepon Pegawai"
                            hint="0123456789"
                            maxlength="16"
                            :rules="telpRules"
                            required
                        ></v-text-field>

                        <v-textarea
                            v-model="formPgw.alamat_pgw"
                            label="Alamat Pegawai"
                            required
                        ></v-textarea>

                        <v-text-field
                            v-model="formPgw.no_rek_pgw"
                            label="No Rekening Pegawai"
                            :rules="noRekRules"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="formPgw.no_ktp_pgw"
                            label="No KTP Pegawai"
                            :rules="ktpRules"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="formPgw.tgl_lahir_pgw"
                            label="Tanggal Lahir"
                            :rules="tanggalRules"
                            type="date"
                            hint=" "
                        ></v-text-field>

                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel">Cancel</v-btn> 
                    <v-btn color="blue darken-1" text @click="setForm">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="1000px">
            <v-card>
                <v-card-title class="text-h5">Anda yakin menghapus data ini?</v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="dialogDelete = false">Cancel</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteItemConfirm">Delete</v-btn>
                    </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDetail" max-width="1000px">
            <v-card>
                <v-card-title class="text-h5">Detail</v-card-title>
                
                <v-card-text>
                    
                    <v-card-title class="justify-center">
                        {{ detailPgw.nama_pegawai }}
                    </v-card-title>

                    <v-card-subtitle class="justify-center">
                        {{ detailPgw.nik }}
                    </v-card-subtitle>

                    <v-card-subtitle class="justify-center">
                        Departemen : {{ detailPgw.nama_departemen }}
                    </v-card-subtitle>
                            
                    <p>No Telepon       : {{ detailPgw.telp_pgw }}</p>
                    <p>Alamat           : {{ detailPgw.alamat_pgw }}</p>
                    <p>No Rekening      : {{ detailPgw.no_rek_pgw }}</p>
                    <p>No KTP           : {{ detailPgw.no_ktp_pgw }}</p>
                    <p>Tanggal Lahir    : {{ detailPgw.tgl_lahir_pgw }}</p>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDetail">Cancel</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
    </v-main>
</template>

<script>
export default 
{
    name: "List",
    data()
    {
        return {
            inputType: 'Tambah',
            load: false,
            snackbar: false,
            error_message: '',
            color: '',
            search: null,
            dialog: false,
            dialogDelete: false,
            dialogDetail: false,
            headers:
            [
                {
                    text: "No",
                    align: "start",
                    sortable: true,
                    value: "id_pegawai",
                },
                { text: "Nama Pegawai", value: "nama_pegawai" },
                { text: "NIK", value: "nik" },
                { text: "Actions", value: "actions" },
            ],
            departemen: [],
            pegawais: [],
            pegawai: new FormData(),
            editId: "",
            deleteId: "",
            deptId: "",
            formPgw: 
            { 
                id_departemen : null, nama_departemen: null, nama_pegawai: null, nik: null, email_pgw: null, 
                telp_pgw: null, alamat_pgw: null, no_rek_pgw: null, no_ktp_pgw: null, tgl_lahir_pgw: null
            },

            detailPgw: 
            { 
                id_departemen : null, nama_departemen: null, nama_pegawai: null, nik: null, email_pgw: null, 
                telp_pgw: null, alamat_pgw: null, no_rek_pgw: null, no_ktp_pgw: null, tgl_lahir_pgw: null
            },

            dptRules: [(v) => !!v || "Departemen Tidak Boleh Kosong"],
            
            tanggalRules: [(v) => !!v || "Tanggal Lahir Tidak Boleh Kosong"],

            ktpRules: [
                value => {
                    if (value?.length < 0) 
                        return 'No KTP tidak boleh kosong'
                    else if (value?.length>16) 
                        return 'No KTP tidak boleh lebih dari 16 digit'
                    else if (!/[^a-z]/.test(value)) 
                        return 'No KTP tidak boleh huruf'
                    else
                        return true
                },
            ],

            nikRules: [
                value => {
                    if (value?.length < 0) 
                        return 'NIK tidak boleh kosong'
                    else if (value?.length>16) 
                        return 'NIK tidak boleh lebih dari 16 digit'
                    else if (!/[^a-z]/.test(value)) 
                        return 'NIK tidak boleh huruf'
                    else
                        return true
                },
            ],

            namaRules: [
                value => {
                    if (value?.length < 0) 
                        return 'Nama tidak boleh kosong'
                    else if (!/[^0-9]/.test(value)) 
                        return 'Nama tidak boleh angka'
                    else
                        return true
                },
            ],

            telpRules: [
                value => {
                    if (value?.length < 0) 
                        return 'Nomor Telepon tidak boleh kosong'
                    else if (value?.length>13) 
                        return 'Nomor Telepon tidak boleh lebih dari 13 digit'
                    else if (!/[^a-z]/.test(value)) 
                        return 'Nomor Telepon tidak boleh huruf'
                    else
                        return true
                },
            ],

            noRekRules: [
                value => {
                    if (value?.length < 0) 
                        return 'Nomor Rekening tidak boleh kosong'
                    else if (value?.length>16) 
                        return 'Nomor Rekening tidak boleh lebih dari 16 digit'
                    else if (!/[^a-z]/.test(value)) 
                        return 'Nomor Rekening tidak boleh huruf'
                    else
                        return true
                },
            ],

            emailRules: [
                (v) => !!v || "Email Tidak Boleh Kosong",
                (v) => /.+@.+\..+/.test(v) || "Email Tidak Valid",
            ],
        }
    },

    methods:
    {
        setForm(){
                if(this.inputType !== 'Tambah')
                {
                    this.update();
                }else
                {
                    this.getDepartemen();
                    this.save();
                }
        },

        getDepartemen() {
            var url = this.$api + "/departemen";
            this.$http.get(url)
                .then((response) => {
                this.departemen = response.data.data;
            })
        },

        readData() {
            var url = this.$api + "/pegawai";
            this.$http.get(url)
                .then((response) => {
                this.pegawais = response.data.data;
            })
        },

        detailItem(item){
            this.editId = item.id_pegawai;

            var url = this.$api + "/pegawai/" + this.editId;
            this.$http.get(url)
                .then((response) => {
                this.pegawais = response.data.data;
            })

            var url1 = this.$api + "/departemen/" + item.id_departemen;
            this.$http.get(url1)
                .then((response) => {
                this.detailPgw.nama_departemen = response.data.data.nama_departemen;
            })

            this.detailPgw.nama_pegawai = item.nama_pegawai;
            this.detailPgw.nik = item.nik;
            this.detailPgw.alamat_pgw = item.alamat_pegawai;
            this.detailPgw.email_pgw = item.email_pegawai;
            this.detailPgw.telp_pgw = item.no_telp_pegawai;
            this.detailPgw.no_rek_pgw = item.no_rek_pegawai;
            this.detailPgw.no_ktp_pgw = item.no_ktp_pegawai;
            this.detailPgw.tgl_lahir_pgw = item.tgl_lahir_pegawai;
            this.dialogDetail = true
        },
        
        save(){
            
            this.pegawai.append('id_departemen', this.formPgw.id_departemen);
            this.pegawai.append('nama_pegawai', this.formPgw.nama_pegawai);
            this.pegawai.append('nik', this.formPgw.nik);
            this.pegawai.append('alamat_pegawai', this.formPgw.alamat_pgw);
            this.pegawai.append('email_pegawai', this.formPgw.email_pgw);
            this.pegawai.append('no_telp_pegawai', this.formPgw.telp_pgw);
            this.pegawai.append('no_rek_pegawai', this.formPgw.no_rek_pgw);
            this.pegawai.append('no_ktp_pegawai', this.formPgw.no_ktp_pgw);
            this.pegawai.append('tgl_lahir_pegawai', this.formPgw.tgl_lahir_pgw);

            var url = this.$api + "/pegawai";
            this.load = true;
            this.$http.post(url, this.pegawai)
            .then((response) => {
                this.error_message = response.data.message;
                this.color = "green";
                this.snackbar = true;
                this.load = true;
                this.close();
                this.readData();
                this.resetForm();
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },

        update(){
            let newData = {
                id_departemen: this.formPgw.id_departemen,
                nama_pegawai: this.formPgw.nama_pegawai,
                nik: this.formPgw.nik,
                alamat_pegawai: this.formPgw.alamat_pgw,
                email_pegawai: this.formPgw.email_pgw,
                no_telp_pegawai: this.formPgw.telp_pgw,
                no_rek_pegawai: this.formPgw.no_rek_pgw,
                no_ktp_pegawai: this.formPgw.no_ktp_pgw,
                tgl_lahir_pegawai: this.formPgw.tgl_lahir_pgw,
            };

            var url = this.$api + "/pegawai/" + this.editId;
            this.load = true;
            this.$http.put(url, newData)
            .then((response) => {
                this.error_message = response.data.message;
                this.color = "green";
                this.snackbar = true;
                this.load = false;
                this.close();
                this.readData();
                this.resetForm();
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },

        deleteItemConfirm(){
            var url = this.$api + "/pegawai/" + this.deleteId;
            this.load = true;
            this.$http.delete(url)
            .then((response) => {
                this.error_message = response.data.message;
                this.color = "green";
                this.snackbar = true;
                this.load = false;
                this.close();
                this.readData();
                this.resetForm();
                this.inputType = 'Tambah';
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
            this.closeDelete = true;
        },

        editItem(item){
            this.inputType = 'Ubah';
            this.getDepartemen();
            this.editId = item.id_pegawai;
            this.formPgw.id_departemen = item.id_departemen;
            this.formPgw.nama_pegawai = item.nama_pegawai;
            this.formPgw.nik = item.nik;
            this.formPgw.alamat_pgw = item.alamat_pegawai;
            this.formPgw.email_pgw = item.email_pegawai;
            this.formPgw.telp_pgw = item.no_telp_pegawai;
            this.formPgw.no_rek_pgw = item.no_rek_pegawai;
            this.formPgw.no_ktp_pgw = item.no_ktp_pegawai;
            this.formPgw.tgl_lahir_pgw = item.tgl_lahir_pegawai;
            this.dialog = true;
        },

        deleteItem(item){
            this.deleteId = item.id_pegawai;
            this.dialogDelete = true;
        },

        closeDetail(){
            this.resetForm();
            this.readData();
            this.dialogDetail = false;
        },
        close () {
            this.dialog = false
            this.inputType = 'Tambah';
            this.closeDelete = false;
            this.readData();
        },

        cancel(){
            this.resetForm();
            this.readData();
            this.dialog = false;
            this.closeDelete = false;
            this.inputType = 'Tambah';
        },

        resetForm(){
            this.formPgw =  
            { 
                id_departemen : null, nama_departemen: null, nama_pegawai: null, nik: null, email_pgw: null, 
                telp_pgw: null, alamat_pgw: null, no_rek_pgw: null, no_ktp_pgw: null, tgl_lahir_pgw: null
            };
        },

    },

    mounted()
    {
        this.readData();
        this.getDepartemen();
    }
};
</script>