<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5">DATA PO SUPPLIER</h3>
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
                :items="pos"
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
                    <span class="headline">Form PO SUPPLIER</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="formPO.no_po_supplier"
                            label="Nomor PO Supplier"
                            required
                        ></v-text-field>

                        <v-autocomplete
                            v-model="formPO.no_po_buyer"
                            label="Nomor PO Buyer"
                            item-text="no_po_buyer"
                            item-value="no_po_buyer"
                            :items="poBuyer"
                            required
                        ></v-autocomplete>

                        <v-select
                            v-model="formPO.id_supplier"
                            label="Supplier"
                            item-text="nama_supplier"
                            item-value="id_supplier"
                            :items="supplier"
                            required
                        />

                        <v-text-field
                            v-model="formPO.tgl_pembuatan_po"
                            label="Tanggal PO Supplier"
                            :rules="tanggalRules"
                            type="date"
                            hint=" "
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="formPO.tgl_jadi_barang"
                            label="Tanggal Jadi"
                            :rules="tanggalRules"
                            type="date"
                            hint=" "
                        ></v-text-field>

                        <v-text-field
                            v-model="formPO.deskripsi_po"
                            label="Deskripsi PO"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="formPO.ukuran_po_supplier"
                            label="Ukuran"
                            hint="40 x 40 x 30"
                            suffix="cm"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="formPO.jumlah_po"
                            label="Jumlah"
                            hint="dalam pcs"
                            type="number"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="formPO.harga_perunit_supplier"
                            label="Harga Perunit"
                            prefix="Rp"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="formPO.dp"
                            label="DP"
                            prefix="Rp"
                            required
                        ></v-text-field>

                        <v-select
                            v-model="formPO.status"
                            label="Status"
                            :items="status"
                            required
                        ></v-select>

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
                        Supplier :  {{ formPO.nama_supplier }}
                    </p>
                            
                    <p class="justify-center font-weight-bold">
                        No PO Supplier : {{ formPO.no_po_supplier }}
                    </p>
                            
                    <p>Nomor PO Buyer : {{ formPO.no_po_buyer }}</p>
                    <p>Tanggal PO Supplier :{{ formPO.tgl_pembuatan_po }}</p>
                    <p>Tanggal Jadi : {{ formPO.tgl_jadi_barang }}</p>
                    <p>Deskripsi PO : {{ formPO.deskripsi_po }}</p>
                    <p>Ukuran : {{ formPO.ukuran_po_supplier }}</p>
                    <p>Jumlah : {{ formPO.jumlah_po }}</p>
                    <p>Harga Perunit (Rp) : {{ formPO.harga_perunit_supplier }}</p>
                    <p>Total Harga (Rp) : {{ formPO.total_harga }}</p>
                    <p>DP (Rp) : {{ formPO.dp }}</p>
                    <p>Pelunasan (Rp) : {{ formPO.pelunasan_po_supplier }}</p>
                    <p>Status : {{ formPO.status }}</p>
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
                    value: "id_po_supplier",
                },
                { text: "No PO Supplier", value: "no_po_supplier" },
                { text: "No PO Buyer", value: "no_po_buyer" },
                { text: "Supplier", value: "id_supplier" },
                { text: "Status", value: "status_po_supplier" },
                { text: "Actions", value: "actions" },
            ],
            supplier:[],
            poBuyer: [],
            pos: [],
            po: new FormData(),
            editId: "",
            deleteId: "",
            status: ['Draft', 'Diterima', 'DP', 'Barang sudah datang', 'Sudah Lunas'],
            formPO: 
            { 
                no_po_supplier: null, no_po_buyer: null, id_supplier: null, nama_supplier:null, 
                tgl_pembuatan_po: null, tgl_jadi_barang: null, deskripsi_po: null, ukuran_po_supplier: null, 
                jumlah_po: null, harga_perunit_supplier: null, dp: null, status: null
            },
            
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

        getPOBuyer() {
            var url = this.$api + "/po";
            this.$http.get(url)
                .then((response) => {
                this.poBuyer = response.data.data;
            })
        },

        readData() {
            var url = this.$api + "/posupplier";
            this.$http.get(url)
                .then((response) => {
                this.pos = response.data.data;
            })
        },

        detailItem(item){
            this.editId = item.id_po_supplier;

            var url = this.$api + "/posupplier/" + this.editId;
            this.$http.get(url)
                .then((response) => {
                this.pos = response.data.data;
            })

            var url1 = this.$api + "/supplier/" + item.id_supplier;
            this.$http.get(url1)
                .then((response) => {
                this.formPO.nama_supplier = response.data.data.nama_supplier;
            })

            this.formPO.no_po_supplier = item.no_po_supplier;
            this.formPO.no_po_buyer = item.no_po_buyer;
            this.formPO.tgl_pembuatan_po = item.tgl_pembuatan_po;
            this.formPO.tgl_jadi_barang = item.tgl_jadi_barang;
            this.formPO.deskripsi_po = item.deskripsi_po;
            this.formPO.ukuran_po_supplier = item.ukuran_po_supplier;
            this.formPO.jumlah_po = item.jumlah_po;
            this.formPO.harga_perunit_supplier = item.harga_perunit_supplier;
            this.formPO.total_harga = item.total_harga;
            this.formPO.dp = item.dp;
            this.formPO.pelunasan_po_supplier = item.pelunasan_po_supplier;
            this.formPO.status = item.status_po_supplier;
            this.dialogDetail = true
        },
        
        save(){
            
            this.po.append('no_po_supplier', this.formPO.no_po_supplier);
            this.po.append('no_po_buyer', this.formPO.no_po_buyer);
            this.po.append('id_supplier', this.formPO.id_supplier);
            this.po.append('nama_supplier', this.formPO.nama_supplier);
            this.po.append('tgl_pembuatan_po', this.formPO.tgl_pembuatan_po);
            this.po.append('tgl_jadi_barang', this.formPO.tgl_jadi_barang);
            this.po.append('deskripsi_po', this.formPO.deskripsi_po);
            this.po.append('ukuran_po_supplier', this.formPO.ukuran_po_supplier);
            this.po.append('jumlah_po', this.formPO.jumlah_po);
            this.po.append('total_harga', this.formPO.total_harga);
            this.po.append('dp', this.formPO.dp);
            this.po.append('harga_perunit_supplier', this.formPO.harga_perunit_supplier);
            this.po.append('status_po_supplier', this.formPO.status);

            var url = this.$api + "/posupplier";
            this.load = true;
            this.$http.post(url, this.po)
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
                no_po_supplier: this.formPO.no_po_supplier,
                no_po_buyer: this.formPO.no_po_buyer,
                id_supplier: this.formPO.id_supplier,
                nama_supplier: this.formPO.nama_supplier,
                tgl_pembuatan_po: this.formPO.tgl_pembuatan_po,
                tgl_jadi_barang: this.formPO.tgl_jadi_barang,
                deskripsi_po: this.formPO.deskripsi_po,
                ukuran_po_supplier: this.formPO.ukuran_po_supplier,
                jumlah_po: this.formPO.jumlah_po,
                total_harga : this.formPO.total_harga,
                dp: this.formPO.dp,
                harga_perunit_supplier: this.formPO.harga_perunit_supplier,
                status_po_supplier: this.formPO.status,
            };

            var url = this.$api + "/posupplier/" + this.editId;
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
            var url = this.$api + "/posupplier/" + this.deleteId;
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
            this.editId = item.id_po_supplier;
            this.formPO.no_po_supplier = item.no_po_supplier;
            this.formPO.no_po_buyer = item.no_po_buyer;
            this.formPO.id_supplier = item.id_supplier;
            this.formPO.nama_supplier = item.nama_supplier;
            this.formPO.tgl_pembuatan_po = item.tgl_pembuatan_po;
            this.formPO.tgl_jadi_barang = item.tgl_jadi_barang;
            this.formPO.deskripsi_po = item.deskripsi_po;
            this.formPO.ukuran_po_supplier = item.ukuran_po_supplier;
            this.formPO.jumlah_po = item.jumlah_po;
            this.formPO.total_harga = item.total_harga;
            this.formPO.dp = item.dp;
            this.formPO.harga_perunit_supplier = item.harga_perunit_supplier;
            this.formPO.status = item.status_po_supplier;

            this.dialog = true;
        },

        deleteItem(item){
            this.deleteId = item.id_po_supplier;
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
            this.formPO =  
            { 
                no_po_supplier: null, no_po_buyer: null, id_supplier: null, nama_supplier:null, 
                tgl_pembuatan_po: null, tgl_jadi_barang: null, deskripsi_po: null, ukuran_po_supplier: null, 
                jumlah_po: null, harga_perunit_supplier: null, dp: null, status: null
            };
        },
    },

    mounted()
    {
        this.readData();
        this.getPOBuyer();
        this.getSupplier();
        this.getColor();
    }
};
</script>