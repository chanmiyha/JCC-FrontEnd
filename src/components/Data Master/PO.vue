<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5">DATA PO BUYER</h3>
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

                <template v-slot:[`item.status`]="{ item }">
                    <v-chip class="ma-2" :color="getColor(item.status)" outlined>
                        {{ item.status }}
                    </v-chip>
                </template>

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
                    <span class="headline">Form PO BUYER</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-autocomplete
                            v-model="formPO.id_buyer"
                            label="Buyer"
                            item-text="nama_buyer"
                            item-value="id_buyer"
                            :items="buyer"
                            required
                        ></v-autocomplete>

                        <v-text-field
                            v-model="formPO.no_po"
                            label="Nomor PO"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="formPO.tgl_po_rilis"
                            label="Tanggal PO Rilis"
                            :rules="tanggalRules"
                            type="date"
                            hint=" "
                        ></v-text-field>

                        <v-text-field
                            v-model="formPO.tgl_exfac_start"
                            label="Tanggal Ex Factory Start"
                            :rules="tanggalRules"
                            type="date"
                            hint=" "
                        ></v-text-field>

                        <v-text-field
                            v-model="formPO.tgl_exfac_end"
                            label="Tanggal Ex Factory End"
                            :rules="tanggalRules"
                            type="date"
                            hint=" "
                        ></v-text-field>

                        <v-text-field
                            v-model="formPO.kode_hangtag"
                            label="Kode Hangtag"
                        ></v-text-field>

                        <v-text-field
                            v-model="formPO.total_qty_po"
                            label="Total Quantity Order"
                            type="number"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="formPO.total_cost_usd"
                            label="Total Amount"
                            prefix="$"
                            required
                        ></v-text-field>

                        <v-select
                            v-model="formPO.status"
                            label="Status"
                            item-value="status"
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
                        Buyer :  {{ formPO.nama_buyer }}
                    </p>
                            
                    <p class="justify-center font-weight-bold">
                        No PO : {{ formPO.no_po }}
                    </p>
                            
                    <p>Tanggal PO Rilis : {{ formPO.tgl_po_rilis }}</p>
                    <p>Tanggal Ex Factory Start :{{ formPO.tgl_exfac_start }}</p>
                    <p>Tanggal Ex Factory End : {{ formPO.tgl_exfac_end }}</p>
                    <p>Kode Hangtag : {{ formPO.kode_hangtag }}</p>
                    <p>Total Quantity Order : {{ formPO.total_qty_po }}</p>
                    <p>Total Amount ($) : {{ formPO.total_cost_usd }}</p>
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
                    value: "id_po_buyer",
                },
                { text: "Buyer", value: "id_buyer" },
                { text: "No PO", value: "no_po_buyer" },
                { text: "Total Qty", value: "total_qty_po" },
                { text: "Total Amount ($)", value: "total_cost_usd" },
                { text: "Status", value: "status_po_buyer" },
                { text: "Actions", value: "actions" },
            ],
            buyer: [],
            pos: [],
            po: new FormData(),
            editId: "",
            deleteId: "",
            buyerId: "",
            status :["Done", "Stuffing soon", "Production", "Confirmed", "Planning"],
            tanggalRules: [(v) => !!v || "Tanggal Tidak Boleh Kosong"],
            formPO: 
            { 
                id_buyer : null, nama_buyer: null, no_po: null, tgl_po_rilis: null, tgl_exfac_start:null, 
                tgl_exfac_end: null, kode_hangtag: null, total_qty_po: null, total_cost_usd: null, status: null
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

        getBuyer() {
            var url = this.$api + "/buyer";
            this.$http.get(url)
                .then((response) => {
                this.buyer = response.data.data;
            })
        },

        readData() {
            var url = this.$api + "/po";
            this.$http.get(url)
                .then((response) => {
                this.pos = response.data.data;
            })
        },

        detailItem(item){
            this.editId = item.id_po_buyer;

            var url = this.$api + "/po/" + this.editId;
            this.$http.get(url)
                .then((response) => {
                this.pos = response.data.data;
            })

            var url1 = this.$api + "/buyer/" + item.id_buyer;
            this.$http.get(url1)
                .then((response) => {
                this.formPO.nama_buyer = response.data.data.nama_buyer;
            })

            this.formPO.no_po = item.no_po_buyer;
            this.formPO.tgl_po_rilis = item.tgl_po_rilis;
            this.formPO.tgl_exfac_start = item.tgl_exfac_start;
            this.formPO.tgl_exfac_end = item.tgl_exfac_end;
            this.formPO.kode_hangtag = item.kode_hangtag;
            this.formPO.total_qty_po = item.total_qty_po;
            this.formPO.total_cost_usd = item.total_cost_usd;
            this.formPO.status = item.status_po_buyer;
            this.dialogDetail = true
        },
        
        save(){
            
            this.po.append('id_buyer', this.formPO.id_buyer);
            this.po.append('no_po_buyer', this.formPO.no_po);
            this.po.append('tgl_po_rilis', this.formPO.tgl_po_rilis);
            this.po.append('tgl_exfac_start', this.formPO.tgl_exfac_start);
            this.po.append('tgl_exfac_end', this.formPO.tgl_exfac_end);
            this.po.append('kode_hangtag', this.formPO.kode_hangtag);
            this.po.append('total_qty_po', this.formPO.total_qty_po);
            this.po.append('total_cost_usd', this.formPO.total_cost_usd);
            this.po.append('status_po_buyer', this.formPO.status);

            var url = this.$api + "/po";
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
                id_buyer: this.formPO.id_buyer,
                no_po_buyer: this.formPO.no_po,
                tgl_po_rilis: this.formPO.tgl_po_rilis,
                tgl_exfac_start: this.formPO.tgl_exfac_start,
                tgl_exfac_end: this.formPO.tgl_exfac_end,
                kode_hangtag: this.formPO.kode_hangtag,
                total_qty_po: this.formPO.total_qty_po,
                total_cost_usd: this.formPO.total_cost_usd,
                status_po_buyer: this.formPO.status,
                
            };

            var url = this.$api + "/po/" + this.editId;
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
            var url = this.$api + "/po/" + this.deleteId;
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
            this.editId = item.id_po_buyer;
            this.formPO.id_buyer = item.id_buyer;
            this.formPO.no_po = item.no_po_buyer;
            this.formPO.tgl_po_rilis = item.tgl_po_rilis;
            this.formPO.tgl_exfac_start = item.tgl_exfac_start;
            this.formPO.tgl_exfac_end = item.tgl_exfac_end;
            this.formPO.kode_hangtag = item.kode_hangtag;
            this.formPO.total_qty_po = item.total_qty_po;
            this.formPO.total_cost_usd = item.total_cost_usd;
            this.formPO.status = item.status_po_buyer;
            this.dialog = true;
        },

        deleteItem(item){
            this.deleteId = item.id_po_buyer;
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
                id_buyer: null, nama_buyer: null, no_po: null, tgl_po_rilis: null, tgl_exfac_start:null, 
                tgl_exfac_end: null, kode_hangtag: null, total_qty_po: null, total_cost_usd: null, status: null
            };
        },

        getColor(status){
            if(status == 'Planning') return 'red'
            else if(status == 'Confirmed') return 'blue'
            else if(status == 'Production') return 'purple'
            else if(status == 'Stuffing soon') return 'deep-orange'
            else if(status == 'Done') return 'green'
        }
    },

    mounted()
    {
        this.readData();
        this.getBuyer();
        this.getColor();
    }
};
</script>