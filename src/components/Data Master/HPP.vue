<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5">DATA HARGA BARANG SUPPLIER</h3>
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
                :items="hpps"
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
                    <span class="headline">Form HARGA BARANG SUPPLIER</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-select
                            v-model="formHpp.id_supplier"
                            label="Supplier"
                            item-text="nama_supplier"
                            item-value="id_supplier"
                            :items="supplier"
                            required
                        />

                        <v-autocomplete
                            v-model="formHpp.kode_barang"
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
                            v-model="formHpp.harga_barang"
                            label="Harga Barang"
                            prefix="Rp"
                            required
                        ></v-text-field>

                        <v-select
                            v-model="formHpp.set_pcs"
                            label="Set/Pcs"
                            :items="['Set', 'Pcs']"
                            required
                        ></v-select>

                        <v-text-field
                            v-model="formHpp.tgl_update"
                            label="Tanggal Update"
                            :rules="tanggalRules"
                            type="date"
                            hint=" "
                        ></v-text-field>

                        <v-textarea
                            v-model="formHpp.keterangan"
                            label="Keterangan"
                            placeholder="Harga 1 set 3 pcs, sudah termasuk finishing,
    Harga XL: ?, Harga L: ?"
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
                    <p class="justify-center font-weight-bold">
                        Supplier :  {{ detailHpp.nama_supplier }}
                    </p>
                            
                    <p class="justify-center font-weight-bold">
                        Kode Barang : {{ detailHpp.kode_barang }}
                    </p>
                            
                    <p>Harga : {{ detailHpp.harga_barang }}</p>
                    <p>Harga per{{ detailHpp.set_pcs }}</p>
                    <p>Update : {{ detailHpp.tgl_update }}</p>
                    <p>Keterangan : {{ detailHpp.keterangan }}</p>
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
            set_pcs: ['set', 'pcs'],
            headers:
            [
                {
                    text: "No",
                    align: "start",
                    sortable: true,
                    value: "id_hpp",
                },
                { text: "Nama Supplier", value: "nama_supplier" },
                { text: "Kode Barang", value: "kode_barang" },
                { text: "Desc Barang", value: "desc_barang" },
                { text: "Harga (Rp)", value: "harga_barang" },
                { text: "Set/Pcs", value: "set_pcs" },
                { text: "Actions", value: "actions" },
            ],
            supplier: [],
            barang: [],
            formHpp: { id_supplier : null, nama_supplier: null, kode_barang: null, harga_barang: null, tgl_update: null, keterangan: null, set_pcs: null},
            detailHpp: { id_supplier : null, nama_supplier: null, kode_barang: null, harga_barang: null, tgl_update: null, keterangan: null, set_pcs: null},
            hpps: [],
            hpp: new FormData(),
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

        getSupplier() {
            var url = this.$api + "/supplier";
            this.$http.get(url)
                .then((response) => {
                this.supplier = response.data.data;
            })
        },

        getBarang() {
            var url = this.$api + "/barang";
            this.$http.get(url)
                .then((response) => {
                this.barang = response.data.data;
            })
        },

        readData() {
            var url = this.$api + "/hpp";
            this.$http.get(url)
                .then((response) => {
                this.hpps = response.data.data;
            })
        },

        detailItem(item){
            this.editId = item.id_hpp;

            var url = this.$api + "/hpp/" + this.editId;
            this.$http.get(url)
                .then((response) => {
                this.hpps = response.data.data;
            })

            var url1 = this.$api + "/supplier/" + item.id_supplier;
            this.$http.get(url1)
                .then((response) => {
                this.detailHpp.nama_supplier = response.data.data.nama_supplier;
            })

            this.detailHpp.kode_barang = item.kode_barang;
            this.detailHpp.harga_barang = item.harga_barang;
            this.detailHpp.tgl_update = item.tgl_update_hpp;
            this.detailHpp.keterangan = item.keterangan_hpp;
            this.detailHpp.set_pcs = item.set_pcs;
            this.dialogDetail = true
        },
        
        save(){
            this.hpp.append('id_supplier', this.formHpp.id_supplier);
            this.hpp.append('kode_barang', this.formHpp.kode_barang);
            this.hpp.append('harga_barang', this.formHpp.harga_barang);
            this.hpp.append('tgl_update_hpp', this.formHpp.tgl_update);
            this.hpp.append('keterangan_hpp', this.formHpp.keterangan);
            this.hpp.append('set_pcs', this.formHpp.set_pcs);

            var url = this.$api + "/hpp";
            this.load = true;
            this.$http.post(url, this.hpp)
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
                id_supplier: this.formHpp.id_supplier,
                kode_barang: this.formHpp.kode_barang,
                harga_barang: this.formHpp.harga_barang,
                tgl_update_hpp: this.formHpp.tgl_update,
                keterangan_hpp: this.formHpp.keterangan,
                set_pcs: this.formHpp.set_pcs,
            };

            var url = this.$api + "/hpp/" + this.editId;
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
            var url = this.$api + "/hpp/" + this.deleteId;
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
            this.getSupplier();
            this.getBarang;
            this.editId = item.id_hpp;
            this.formHpp.id_supplier = item.id_supplier;
            this.formHpp.kode_barang = item.kode_barang;
            this.formHpp.harga_barang = item.harga_barang;
            this.formHpp.tgl_update = item.tgl_update_hpp;
            this.formHpp.keterangan = item.keterangan_hpp;
            this.formHpp.set_pcs = item.set_pcs;
            this.dialog = true;
        },

        deleteItem(item){
            this.deleteId = item.id_hpp;
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
            this.supplier = [];
            this.dialog = false;
            this.closeDelete = false;
            this.inputType = 'Tambah';
        },

        resetForm(){
            this.formHpp =  
            { 
                id_supplier : null, nama_supplier: null, kode_barang: null, harga_barang: null, tgl_update: null, keterangan: null
            };
        },

    },

    mounted()
    {
        this.readData();
        this.getSupplier();
        this.getBarang();
    }
};
</script>