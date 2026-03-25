<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5">PO SUPPLIER</h3>
        <v-card> 
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>

            <v-data-table
                :headers="headers"
                :items="pos"
                :search="search"
            >
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon color = "blue" @click="previewItem(item)"> mdi-printer </v-icon>
                    <v-icon @click="detailItem(item)"> mdi-chevron-right </v-icon>
                </template>
            </v-data-table>
        </v-card>

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

        <v-dialog v-model="dialogPreview" max-width="1500px">
            <v-card height="20%" style="background: #F2E3D5; border-radius: 4px 4px 0px 0px">
                <v-card-title>
                    <h3 style="font-size:20px; color:black">Pratinjau</h3>
                    <v-spacer />
                    <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on" @click="close" style="font-size: 28px" link color="error">mdi-close</v-icon>
                        </template>
                        <span>Tutup</span>
                    </v-tooltip>
                </v-card-title>
            </v-card>
            
            <v-card style="border-radius: 0px 0px 4px 4px; padding-bottom: 6.5%;overflow-x: hidden">
                <span>
                    <v-spacer />
                    <v-btn small color="primary" dark style="float:right; margin-top: 3%;margin-right:3%" @click="cetak">Cetak</v-btn>
                    <v-spacer />

                    <span id="POSupplier">
                        <v-card-text style="padding:30px; margin-top: 3%">
                            <h2 style="margin-top:7.5px;padding-bottom:40px">PURCHASE ORDER PRODUKSI</h2>
                            <span style="float:left;">Supplier</span> <span style="float:left;margin-left:65px">: </span> <span style="float:left;margin-left:3px"> {{ formPO.nama_supplier }}</span> <br/>
                            <span style="float:left;">No PO Supplier</span> <span style="float:left;margin-left:17px">: </span> <span style="float:left;margin-left:3px"> {{ formPO.no_po_supplier }}</span> <br/>
                            <span style="float:left;">No PO Buyer</span> <span style="float:left;margin-left:32px">: </span> <span style="float:left;margin-left:3px"> {{ formPO.no_po_buyer }}</span> <br/><br/>

                            <span style="float:left;">Tanggal PO </span> <span style="float:left;margin-left:39px">: </span> <span style="float:left;margin-left:3px"> {{ formPO.tgl_pembuatan_po }}</span> <br/>
                            <span style="float:left;">Tanggal Jadi</span> <span style="float:left;margin-left:34px">: </span> <span style="float:left;margin-left:3px"> {{ formPO.tgl_jadi_barang }}</span> <br/><br/>
                            
                            <v-row no-gutters>
                                <v-col
                                    cols="auto"
                                    md="1"
                                >
                                    <v-card
                                        class="pa-2 d-flex align-center justify-center"
                                        outlined
                                        tile
                                        style="text-align:center;"
                                    >
                                        <strong>No</strong>
                                    </v-card>
                                </v-col>

                                <v-col
                                    cols="auto"
                                    md="4"
                                >
                                    <v-card
                                        class="pa-2 d-flex align-center justify-center"
                                        outlined
                                        tile
                                        style="text-align:center;"
                                    >
                                        <strong>Deskripsi</strong>
                                    </v-card>
                                </v-col>

                                <v-col
                                    cols="auto"
                                    md="2"
                                >
                                    <v-card
                                        class="pa-2 d-flex align-center justify-center"
                                        outlined
                                        tile
                                        style="text-align:center;"
                                    >
                                        <strong>Ukuran (cm)</strong>
                                    </v-card>
                                </v-col>

                                <v-col
                                    cols="auto"
                                    md="1"
                                >
                                    <v-card
                                        class="pa-2 d-flex align-center justify-center"
                                        outlined
                                        tile
                                        style="text-align:center;"
                                    >
                                        <strong>Jumlah</strong>
                                    </v-card>
                                </v-col>

                                <v-col
                                    cols="auto"
                                    md="2"
                                >
                                    <v-card
                                        class="pa-2 d-flex align-center justify-center"
                                        outlined
                                        tile
                                        style="text-align:center;"
                                    >
                                        <strong>Harga per Unit (Rp)</strong>
                                    </v-card>
                                </v-col>
                                
                                <v-col
                                    cols="auto"
                                    md="2"
                                >
                                    <v-card
                                        class="pa-2 d-flex align-center justify-center"
                                        outlined
                                        tile
                                        style="text-align:center;"
                                    >
                                        <strong>Total Harga (Rp)</strong>
                                    </v-card>
                                </v-col>
                            </v-row>

                            <v-row no-gutters align="stretch">
                                <v-col
                                    cols="auto"
                                    md="1"
                                >
                                    <v-card
                                        class="pa-2 d-flex align-center justify-center"
                                        outlined
                                        tile
                                        style="text-align:center;"
                                    >
                                        <span>{{ formPO.id_po_supplier  }}</span>
                                    </v-card>
                                </v-col>

                                <v-col
                                    cols="auto"
                                    md="4"
                                >
                                    <v-card
                                        class="pa-2 d-flex align-center justify-center"
                                        outlined
                                        tile
                                        style="text-align:center;"
                                    >
                                        <span>{{ formPO.deskripsi_po }}</span>
                                    </v-card>
                                </v-col>

                                <v-col
                                    cols="auto"
                                    md="2"
                                >
                                    <v-card
                                        class="pa-2 d-flex align-center justify-center"
                                        outlined
                                        tile
                                        style="text-align:center;"
                                    >
                                        <span>{{ formPO.ukuran_po_supplier }}</span>
                                    </v-card>
                                </v-col>

                                <v-col
                                    cols="auto"
                                    md="1"
                                >
                                    <v-card
                                        class="pa-2 d-flex align-center justify-center"
                                        outlined
                                        tile
                                        style="text-align:left;"
                                    >
                                        <span style="margin-left:5px">{{ formPO.jumlah_po }}</span>
                                    </v-card>
                                </v-col>

                                <v-col
                                    cols="auto"
                                    md="2"
                                >
                                    <v-card
                                        class="pa-2 d-flex align-center justify-center"
                                        outlined
                                        tile
                                        style="text-align:left;"
                                    >
                                        <span style="margin-left:5px">{{ formPO.harga_perunit_supplier }}</span>
                                    </v-card>
                                </v-col>

                                <v-col
                                    cols="auto"
                                    md="2"
                                >
                                    <v-card
                                        class="pa-2 d-flex align-center justify-center"
                                        outlined
                                        tile
                                        style="text-align:left;"
                                    >
                                        <span style="margin-left:5px">{{ formPO.total_harga }}</span>
                                    </v-card>
                                </v-col>
                            </v-row>

                            <br/><br/>
                            <span style="float:left;">DP (Rp)</span> <span style="float:left;margin-left:7cap">: </span> <span style="float:left;margin-left:3px"> {{ formPO.dp }}</span> <br/>
                            <span style="float:left;">Pelunasan (Rp)</span> <span style="float:left;margin-left:23px">: </span> <span style="float:left;margin-left:3px"> {{ formPO.pelunasan_po_supplier }}</span> <br/><br/>

                            <span style="float:left;">Status PO</span> <span style="float:left;margin-left:55px">: </span> <span style="float:left;margin-left:3px"> {{ formPO.status }}</span> <br/>
                            
                        </v-card-text>
                    </span>
                </span>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
    </v-main>
</template>

<script>
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default 
{
    name: "List",

    watch: {
            $route: {
                immediate: true,

                handler() {
                    document.title = "PURCHASE ORDER PRODUKSI";
                },
            },
        },

    data()
    {
        return {
            load: false,
            snackbar: false,
            error_message: '',
            color: '',
            search: null,
            dialogDetail: false,
            dialogPreview : false,
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
            transaksi: [],
            po: new FormData(),
            editId: "",
            deleteId: "",
            formPO: 
            { 
                id_po_supplier : null,no_po_supplier: null, no_po_buyer: null, id_supplier: null, nama_supplier:null, 
                tgl_pembuatan_po: null, tgl_jadi_barang: null, deskripsi_po: null, ukuran_po_supplier: null, 
                jumlah_po: null, harga_perunit_supplier: null, total_harga : null, dp: null, pelunasan_po_supplier: null, status: null
            },
            
        }
    },

    methods:
    {
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

        closeDetail(){
            this.resetForm();
            this.readData();
            this.dialogDetail = false;
        },

        previewItem(item){
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

            this.formPO.id_po_supplier = item.id_po_supplier;
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
            this.dialogPreview = true
        },


        cetak() {
            var report;
            var reportName = "";
            this.overlay = true;

            report = document.getElementById("POSupplier");
            reportName = "PURCHASE ORDER PRODUKSI";

            html2canvas(report).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgWidth = 210;
                const pageHeight = 295;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                pdf.save(reportName + '.pdf');

                this.close();
                this.resetForm();
                this.overlay = false;
                location.reload();
            });
        },

        close() {
            this.resetForm();
            this.dialogPreview = false;
            location.reload();
        },

        resetData() {
            this.resetForm();
        },

        resetForm(){
            this.formPO =  
            { 
                id_po_supplier: null, no_po_supplier: null, no_po_buyer: null, id_supplier: null, nama_supplier:null, 
                tgl_pembuatan_po: null, tgl_jadi_barang: null, deskripsi_po: null, ukuran_po_supplier: null, 
                jumlah_po: null, harga_perunit_supplier: null, total_harga : null, dp: null, pelunasan_po_supplier: null, status: null
            };
        },
    },

    mounted()
    {
        this.readData();
        this.getPOBuyer();
        this.getSupplier();
    }
};
</script>