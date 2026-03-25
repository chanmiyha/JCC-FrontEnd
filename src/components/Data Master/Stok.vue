<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5">DATA STOK</h3>
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
                :items="stoks"
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
                    <span class="headline">Form Stok</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-autocomplete
                            v-model="formStok.kode_barang"
                            label="Kode Barang"
                            hint="78-BNA0000"
                            maxlength="11"
                            :rules="kodeBarangRules"
                            item-text="kode_barang"
                            item-value="kode_barang"
                            :items="barang"
                            required
                        ></v-autocomplete>

                        <v-text-field
                            v-model="formStok.jml_barang"
                            label="Jumlah"
                            type="number"
                            required
                        ></v-text-field>

                        <v-select
                            v-model="formStok.set_pcs"
                            label="Set/Pcs"
                            :items="['Set', 'Pcs']"
                            required
                        ></v-select>

                        <v-text-field
                            v-model="formStok.tgl_update"
                            label="Tanggal Update"
                            :rules="tanggalRules"
                            type="date"
                            hint=" "
                        ></v-text-field>

                        <v-textarea
                            v-model="formStok.keterangan_stok"
                            label="Keterangan"
                            placeholder=""
                            required
                        ></v-textarea>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel">Cancel</v-btn> 
                    <v-btn color="blue darken-1" text @click="setForm">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDetail" max-width="1000px">
            <v-card>
                <v-card-title class="text-h5">Detail</v-card-title>
                
                <v-card-text>
                    <v-card-title class="justify-center">
                        {{ formStok.kode_barang }}
                    </v-card-title>
                            
                    <p>Jumlah           : {{ formStok.jml_barang }} {{ formStok.set_pcs }}</p>
                    <p>Tanggal Update   : {{ formStok.tgl_update }}</p>
                    <p>keterangan       : {{ formStok.keterangan_stok }}</p>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDetail">Cancel</v-btn>
                    <v-spacer></v-spacer>
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
                    value: "id_stok",
                },
                { text: "Kode Barang", value: "kode_barang" },
                { text: "Desc Barang", value: "desc_barang" },
                { text: "Jumlah", value: "jml_barang" },
                { text: "Set/Pcs", value: "set_pcs" },
                { text: "Actions", value: "actions" },
            ],
            stoks: [],
            barang: [],
            formStok: { kode_barang: null, jml_barang: null, set_pcs: null, tgl_update: null, keterangan_stok: null},
            stok: new FormData(),
            editId: "",
            deleteId: "",
            tanggalRules: [(v) => !!v || "Tanggal Update Tidak Boleh Kosong"],
            kodeBarangRules: [(v) => !!v || "Kode Barang Tidak Boleh Kosong"],
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

        getBarang() {
            var url = this.$api + "/barang";
            this.$http.get(url)
                .then((response) => {
                this.barang = response.data.data;
            })
        },

        readData() {
            var url = this.$api + "/stok";
            this.$http.get(url)
                .then((response) => {
                this.stoks = response.data.data;
            })
        },

        detailItem(item){
            this.editId = item.id_stok;

            var url = this.$api + "/stok/" + this.editId;
            this.$http.get(url)
                .then((response) => {
                this.stoks = response.data.data;
            })

            this.formStok.kode_barang = item.kode_barang;
            this.formStok.jml_barang = item.jml_barang;
            this.formStok.set_pcs = item.set_pcs;
            this.formStok.tgl_update = item.tgl_update;
            this.formStok.keterangan_stok = item.keterangan_stok;
            this.dialogDetail = true
        },
        
        save(){
            
            this.stok.append('kode_barang', this.formStok.kode_barang);
            this.stok.append('jml_barang', this.formStok.jml_barang);
            this.stok.append('set_pcs', this.formStok.set_pcs);
            this.stok.append('tgl_update', this.formStok.tgl_update);
            this.stok.append('keterangan_stok', this.formStok.keterangan_stok);

            var url = this.$api + "/stok";
            this.load = true;
            this.$http.post(url, this.stok)
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
                kode_barang: this.formStok.kode_barang,
                jml_barang: this.formStok.jml_barang,
                set_pcs: this.formStok.set_pcs,
                tgl_update: this.formStok.tgl_update,
                keterangan_stok: this.formStok.keterangan_stok,
            };

            var url = this.$api + "/stok/" + this.editId;
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
            var url = this.$api + "/stok/" + this.deleteId;
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
            this.editId = item.id_stok;
            this.formStok.kode_barang = item.kode_barang;
            this.formStok.jml_barang = item.jml_barang;
            this.formStok.set_pcs = item.set_pcs;
            this.formStok.tgl_update = item.tgl_update;
            this.formStok.keterangan_stok = item.keterangan_stok;
            this.dialog = true;
        },

        deleteItem(item){
            this.deleteId = item.id_stok;
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
            this.formStok =  
            { 
                kode_barang: null, jml_barang: null, set_pcs: null, tgl_update: null, keterangan_stok: null
            };
        },

    },

    mounted()
    {
        this.readData();
        this.getBarang();
    }
};
</script>