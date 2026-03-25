<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5">DATA DETAIL PO BUYER</h3>
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
                :items="details"
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
                    <span class="headline">Form Detail PO</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-autocomplete
                            v-model="formDetailPO.kode_barang"
                            label="Kode Barang"
                            hint="78-BNA0000"
                            maxlength="11"
                            :rules="kodeBarangRules"
                            item-text="kode_barang"
                            item-value="kode_barang"
                            :items="barang"
                            required
                        ></v-autocomplete>

                        <v-autocomplete
                            v-model="formDetailPO.no_po_buyer"
                            label="Nomor PO"
                            item-text="no_po_buyer"
                            item-value="no_po_buyer"
                            :items="poBuyer"
                            required
                        ></v-autocomplete>

                        <v-text-field
                            v-model="formDetailPO.distro"
                            label="Distro"
                            hint="Jika tidak ada distro, masukkan -"
                        ></v-text-field>

                        <v-text-field
                            v-model="formDetailPO.qty_order"
                            label="Quantity Order"
                            type="number"
                            required
                        ></v-text-field>

                        
                        <v-select
                            v-model="formDetailPO.set_pcs"
                            label="Set/Pcs"
                            :items="[
                                { text: 'Set', value: 'Set' },
                                { text: 'Pcs', value: 'Pcs' }
                            ]"
                            item-title="text"
                            item-value="value"
                            required
                        ></v-select>

                        <v-text-field
                            v-model="formDetailPO.cost"
                            label="First Cost"
                            prefix="$"
                            required
                        ></v-text-field>

                        <v-textarea
                            v-model="formDetailPO.keterangan_barang"
                            label="Keterangan Barang"
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
                        Kode Barang :  {{ formDetailPO.kode_barang }}
                    </p>
                            
                    <p class="justify-center font-weight-bold">
                        No PO : {{ formDetailPO.no_po_buyer }}
                    </p>
                            
                    <p>Distro : {{ formDetailPO.distro }}</p>
                    <p>Quantity Order :{{ formDetailPO.qty_order }} {{ formDetailPO.set_pcs }}</p>
                    <p>First Cost ($) : {{ formDetailPO.cost }}</p>
                    <p>Keterangan Barang : {{ formDetailPO.keterangan_barang }}</p>
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
                    value: "id_detailpo",
                },
                { text: "Kode Barang", value: "kode_barang" },
                { text: "No PO", value: "no_po_buyer" },
                { text: "Distro", value: "distro" },
                { text: "Quantity Order", value: "qty_order" },
                { text: "Set/Pcs", value: "set_pcs" },
                { text: "Actions", value: "actions" },
            ],
            details: [],
            barang: [],
            set_pcs: [],
            poBuyer: [],
            detail: new FormData(),
            editId: "",
            deleteId: "",
            formDetailPO: { kode_barang: null, no_po_buyer: null, distro: null, qty_order: null, cost: null, keterangan_barang: null, set_pcs: null},
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

        getPOBuyer() {
            var url = this.$api + "/po";
            this.$http.get(url)
                .then((response) => {
                this.poBuyer = response.data.data;
            })
        },

        readData() {
            var url = this.$api + "/detailpo";
            this.$http.get(url)
                .then((response) => {
                this.details = response.data.data;
            })
        },

        detailItem(item){
            this.editId = item.id_detailpo;

            var url = this.$api + "/detailpo/" + this.editId;
            this.$http.get(url)
                .then((response) => {
                this.details = response.data.data;
            })

            this.formDetailPO.kode_barang = item.kode_barang;
            this.formDetailPO.no_po_buyer = item.no_po_buyer;
            this.formDetailPO.distro = item.distro;
            this.formDetailPO.qty_order = item.qty_order;
            this.formDetailPO.set_pcs = item.set_pcs;
            this.formDetailPO.cost = item.cost;
            this.formDetailPO.keterangan_barang = item.keterangan_barang;
            this.dialogDetail = true
        },
        
        save(){
            
            this.detail.append('kode_barang', this.formDetailPO.kode_barang);
            this.detail.append('no_po_buyer', this.formDetailPO.no_po_buyer);
            this.detail.append('distro', this.formDetailPO.distro);
            this.detail.append('qty_order', this.formDetailPO.qty_order);
            this.detail.append('set_pcs', this.formDetailPO.set_pcs);
            this.detail.append('cost', this.formDetailPO.cost);
            this.detail.append('keterangan_barang', this.formDetailPO.keterangan_barang);

            var url = this.$api + "/detailpo";
            this.load = true;
            this.$http.post(url, this.detail)
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
                kode_barang: this.formDetailPO.kode_barang,
                no_po_buyer: this.formDetailPO.no_po_buyer,
                distro: this.formDetailPO.distro,
                qty_order: this.formDetailPO.qty_order,
                set_pcs: this.formDetailPO.set_pcs,
                cost: this.formDetailPO.cost,
                keterangan_barang: this.formDetailPO.keterangan_barang,
            };

            var url = this.$api + "/detailpo/" + this.editId;
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
            var url = this.$api + "/detailpo/" + this.deleteId;
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
            this.editId = item.id_detailpo;
            this.formDetailPO.kode_barang = item.kode_barang;
            this.formDetailPO.no_po_buyer = item.no_po_buyer;
            this.formDetailPO.distro = item.distro;
            this.formDetailPO.qty_order = item.qty_order;
            this.formDetailPO.set_pcs = item.set_pcs;
            this.formDetailPO.cost = item.cost;
            this.formDetailPO.keterangan_barang = item.keterangan_barang;
            this.dialog = true;
        },

        deleteItem(item){
            this.deleteId = item.id_detailpo;
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
            this.departemen = [];
            this.dialog = false;
            this.closeDelete = false;
            this.inputType = 'Tambah';
        },

        resetForm(){
            this.formDetailPO =  
            { 
                kode_barang: null, no_po_buyer: null, distro: null, qty_order: null, cost: null, keterangan_barang: null, set_pcs: null
            };
        },
    },

    mounted()
    {
        this.readData();
        this.getBarang();
        this.getPOBuyer();
    }
};
</script>