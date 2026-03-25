<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5">DATA SUPPLIER</h3>
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
                :items="suppliers"
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
                    <span class="headline">Form Supplier</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="formSupplier.nama_supplier"
                            label="Nama Supplier"
                            :rules="nameRules"
                            required
                        ></v-text-field>

                        <v-textarea
                            v-model="formSupplier.alamat_supplier"
                            label="Alamat Suplier"
                            required
                        ></v-textarea>

                        <v-text-field
                            v-model="formSupplier.telp_supplier"
                            label="Nomor Supplier"
                            hint="0123456789"
                            maxlength="16"
                            :rules="telpRules"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="formSupplier.bank_supplier"
                            label="Bank"
                            hint="BRI/BNI/BCA"
                            maxlength="16"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="formSupplier.norek_supplier"
                            label="No Rekening Supplier"
                            :rules="noRekRules"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="formSupplier.ktp_supplier"
                            label="No KTP Supplier"
                            :rules="ktpRules"
                            required
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
                        {{ detailSupplier.nama_supplier }}
                    </v-card-title>

                            
                    <p>Alamat           : {{ detailSupplier.alamat_supplier }}</p>
                    <p>No Telepon       : {{ detailSupplier.telp_supplier }}</p>
                    <p>No KTP      : {{ detailSupplier.ktp_supplier }}</p>
                    <p>Bank             : {{ detailSupplier.bank_supplier }}</p>
                    <p>No Rekening      : {{ detailSupplier.norek_supplier }}</p>
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
            nameRules: [
                value => {
                    if (value?.length < 0) 
                        return 'Nama tidak boleh kosong'
                    else if (!/[^0-9]/.test(value)) 
                        return 'Nama tidak boleh angka'
                    else
                        return true
                },
            ],

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

            headers:
            [
                {
                    text: "No",
                    align: "start",
                    sortable: true,
                    value: "id_supplier",
                },
                { text: "Nama Supplier", value: "nama_supplier" },
                { text: "Actions", value: "actions" },
            ],
            suppliers: [],
            supplier: new FormData(),
            editId: "",
            deleteId: "",
            formSupplier: { nama_supplier: null, alamat_supplier: null, telp_supplier: null, bank_supplier: null, norek_supplier: null, ktp_supplier: null},
            detailSupplier: { nama_supplier: null, alamat_supplier: null, telp_supplier: null, bank_supplier: null, norek_supplier: null, ktp_supplier: null},

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
                    this.save();
                }
        },

        readData() {
            var url = this.$api + "/supplier";
            this.$http.get(url)
                .then((response) => {
                this.suppliers = response.data.data;
            })
        },

        detailItem(item){
            this.editId = item.id_supplier;

            var url = this.$api + "/supplier/" + this.editId;
            this.$http.get(url)
                .then((response) => {
                this.suppliers = response.data.data;
            })

            this.detailSupplier.nama_supplier = item.nama_supplier;
            this.detailSupplier.telp_supplier = item.no_telp_supplier;
            this.detailSupplier.alamat_supplier = item.alamat_supplier;
            this.detailSupplier.bank_supplier = item.bank_supplier;
            this.detailSupplier.norek_supplier = item.no_rek_supplier;
            this.detailSupplier.ktp_supplier = item.no_ktp_supplier;
            this.dialogDetail = true
        },
        
        save(){
            this.supplier.append('nama_supplier', this.formSupplier.nama_supplier);
            this.supplier.append('no_telp_supplier', this.formSupplier.telp_supplier);
            this.supplier.append('alamat_supplier', this.formSupplier.alamat_supplier);
            this.supplier.append('bank_supplier', this.formSupplier.bank_supplier);
            this.supplier.append('no_rek_supplier', this.formSupplier.norek_supplier);
            this.supplier.append('no_ktp_supplier', this.formSupplier.ktp_supplier);

            var url = this.$api + "/supplier";
            this.load = true;
            this.$http.post(url, this.supplier)
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
                nama_supplier: this.formSupplier.nama_supplier,
                no_telp_supplier: this.formSupplier.telp_supplier,
                alamat_supplier: this.formSupplier.alamat_supplier,
                bank_supplier: this.formSupplier.bank_supplier,
                no_rek_supplier: this.formSupplier.norek_supplier,
                no_ktp_supplier: this.formSupplier.ktp_supplier,
            };

            var url = this.$api + "/supplier/" + this.editId;
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
            var url = this.$api + "/supplier/" + this.deleteId;
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
            this.editId = item.id_supplier;
            this.formSupplier.nama_supplier = item.nama_supplier;
            this.formSupplier.telp_supplier = item.no_telp_supplier;
            this.formSupplier.alamat_supplier = item.alamat_supplier;
            this.formSupplier.bank_supplier = item.bank_supplier;
            this.formSupplier.norek_supplier = item.no_rek_supplier;
            this.formSupplier.ktp_supplier = item.no_ktp_supplier;
            this.dialog = true;
        },

        deleteItem(item){
            this.deleteId = item.id_supplier;
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
            this.formSupplier =  
            { 
                nama_supplier: null, alamat_supplier: null, telp_supplier: null, 
                bank_supplier: null, norek_supplier: null, ktp_supplier: null
            };
        },

    },

    mounted()
    {
        this.readData();
    }
};
</script>