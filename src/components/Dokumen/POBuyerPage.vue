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
            </v-card-title>

            <v-card-text>               
                <v-row dense align="center">
                    <v-col cols="6" md="2">
                        <v-select
                            v-model="form.id_bulan"
                            :items="bulan"
                            item-text="nama_bulan"
                            item-value="id_bulan"
                            label="Bulan PO Rilis"
                        />
                    </v-col>

                    <v-col cols="6" md="2">
                        <v-select
                            v-model="form.nama_tahun"
                            :items="tahun"
                            item-text="nama_tahun"
                            item-value="nama_tahun"
                            label="Tahun PO Rilis"
                        />
                    </v-col>

                    <v-col cols="12" md="2">
                        <v-select
                            v-model="form.id_buyer"
                            :items="buyer"
                            item-text="nama_buyer"
                            item-value="id_buyer"
                            label="Buyer"
                        />
                    </v-col>
                </v-row>

                <v-row dense align="center">
                    <v-col cols="12" md="2" class="d-flex align-center">
                        
                        <v-btn color="primary"  dark class="mr-2" @click="previewLaporan">PROSES</v-btn>
                        <v-btn color="blue-grey"  dark class="mr-2" @click="resetForm">RESET</v-btn>
                    </v-col>
                </v-row>
            </v-card-text>


            <v-data-table
                :headers="headers"
                :items="pos"
                :search="search"
            >
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon color="blue" @click="previewItem(item)">mdi-printer</v-icon>
                    <v-icon @click="detailItem(item)">mdi-chevron-right</v-icon>
                </template>
            </v-data-table>
        </v-card>


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
                    <p>Status : {{ formPO.status }}</p>

                    <p class="justify-center font-weight-bold">DETAIL</p>
                    
                    <v-row
                        v-for="(item, index) in details"
                        :key="item.id_detailpo"
                        class="mb-2"
                        dense
                        >
                        <v-col cols="12" md="3">
                            <strong>No Barang:</strong> {{ index + 1 }}
                        </v-col>
                        <v-col cols="12" md="3">
                            <strong>Kode Barang:</strong> {{ item.kode_barang }}
                        </v-col>
                        <v-col cols="12" md="3">
                            <strong>Quantity Order:</strong> {{ item.qty_order }}
                        </v-col>
                        <v-col cols="12" md="3">
                            <strong>First Cost:</strong> $ {{ item.cost }}
                        </v-col>
                    </v-row>


                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDetail">Cancel</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="invoicePreview" max-width="1500px">
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
                    <v-btn small color="primary" dark style="float:right; margin-top: 3%;margin-right:3%" @click="cetakInvoice">Cetak</v-btn>
                    <v-spacer />

                    <div id="InvoiceBuyer">
                        <v-card-text style="padding:30px; margin-top: 3%">
                            <h2 style="margin-top:7.5px;padding-bottom:40px">INVOICE  PT THE JAVA CREACRAFT</h2>
                            <span style="float:left;">Buyer</span> <span style="float:left;margin-left:65px">: </span> <span style="float:left;margin-left:3px"> {{ formPO.nama_buyer }}</span> <br/>
                            <span style="float:left;">No PO</span> <span style="float:left;margin-left:57px">: </span> <span style="float:left;margin-left:3px"> {{ formPO.no_po }}</span> <br/><br/>
                            
                            <span style="float:left;">Tanggal PO Rilis</span> <span style="float:left;margin-left:32px">: </span> <span style="float:left;margin-left:3px"> {{ formPO.tgl_po_rilis }}</span> <br/><br/>

                            <span style="float:left;">Tanggal Ex Factory Start</span> <span style="float:left;margin-left:30px">: </span> <span style="float:left;margin-left:3px"> {{ formPO.tgl_exfac_start }}</span> <br/>
                            <span style="float:left;">Tanggal Ex Factory End</span> <span style="float:left;margin-left:34px">: </span> <span style="float:left;margin-left:3px"> {{ formPO.tgl_exfac_end }}</span> <br/><br/>
                            
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
                                    md="3"
                                >
                                    <v-card
                                        class="pa-2 d-flex align-center justify-center"
                                        outlined
                                        tile
                                        style="text-align:center;"
                                    >
                                        <strong>Kode Barang</strong>
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
                                        <strong>Jumlah</strong>
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
                                        <strong>Set/Pcs</strong>
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
                                        <strong>Harga per Unit (USD)</strong>
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
                                        <strong>Total Harga (USD)</strong>
                                    </v-card>
                                </v-col>
                            </v-row>

                            <v-row 
                                no-gutters 
                                align="stretch"
                                v-for="(item, index) in details"
                                :key="item.id_detailpo"
                            >
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
                                        <span>{{ index + 1 }}</span>
                                    </v-card>
                                </v-col>

                                <v-col
                                    cols="auto"
                                    md="3"
                                >
                                    <v-card
                                        class="pa-2 d-flex align-center justify-center"
                                        outlined
                                        tile
                                        style="text-align:center;"
                                    >
                                        <span>{{ item.kode_barang }}</span>
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
                                        <span>{{ item.qty_order }}</span>
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
                                        <span style="margin-left:5px">{{ item.set_pcs }}</span>
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
                                        <span style="margin-left:5px">{{ item.cost }}</span>
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
                                        <span style="margin-left:5px">{{ (item.qty_order * item.cost).toFixed(2) }}</span>
                                    </v-card>
                                </v-col>
                            </v-row>

                        </v-card-text>
                    </div>

                </span>
            </v-card>

        </v-dialog>

        <v-dialog v-model="laporanPreview" max-width="1500px">
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
                    <v-btn small color="primary" dark style="float:right; margin-top: 3%;margin-right:3%" @click="cetakInvoice">Cetak</v-btn>
                    <v-spacer />

                    <div id="laporanPreview">
                        <v-card-text style="padding:30px; margin-top: 3%">
                            <h2 style="margin-top:7.5px;padding-bottom:40px">LAPORAN PO BUYER PT THE JAVA CREACRAFT</h2>
                            <span style="float:left;">Buyer</span> <span style="float:left;margin-left:65px">: </span> <span style="float:left;margin-left:3px"> {{ form.nama_buyer }}</span> <br/>
                            <span style="float:left;">Bulan</span> <span style="float:left;margin-left:65px">: </span> <span style="float:left;margin-left:3px"> {{ form.nama_bulan }} {{ form.nama_tahun }}</span> <br/><br/>

                            <v-row no-gutters class="border" style="border:1px solid #ccc;">
                                <v-col md="1" class="pa-2 text-center font-weight-bold" style="border:1px solid #ccc; border-top:none;">No</v-col>
                                <v-col md="2" class="pa-2 text-center font-weight-bold" style="border:1px solid #ccc; border-top:none;">No PO Buyer</v-col>
                                <v-col md="2" class="pa-2 text-center font-weight-bold" style="border:1px solid #ccc; border-top:none;">Kode Barang</v-col>
                                <v-col md="1" class="pa-2 text-center font-weight-bold" style="border:1px solid #ccc; border-top:none;">Jumlah</v-col>
                                <v-col md="1" class="pa-2 text-center font-weight-bold" style="border:1px solid #ccc; border-top:none;">Set/Pcs</v-col>
                                <v-col md="2" class="pa-2 text-center font-weight-bold" style="border:1px solid #ccc; border-top:none;">Harga per Unit (USD)</v-col>
                                <v-col md="3" class="pa-2 text-center font-weight-bold" style="border:1px solid #ccc; border-top:none;">Total Harga (USD)</v-col>
                            </v-row>

                            <v-row
                                v-for="(po, i) in pos"
                                :key="'po-' + i"
                                no-gutters
                                style="border:1px solid #ccc; border-top:none;"
                            >
                                <v-col md="1" class="pa-2 text-center" style="border:1px solid #ccc; border-top:none;">{{ i + 1 }}</v-col>
                                <v-col md="2" class="pa-2 text-center" style="border:1px solid #ccc; border-top:none;">{{ po.no_po_buyer }}</v-col>
                                <v-col md="2" class="pa-2 text-center" style="border:1px solid #ccc; border-top:none;">{{ po.kode_barang }}</v-col>
                                <v-col md="1" class="pa-2 text-center" style="border:1px solid #ccc; border-top:none;">{{ po.qty_order }}</v-col>
                                <v-col md="1" class="pa-2 text-center" style="border:1px solid #ccc; border-top:none;">{{ po.set_pcs }}</v-col>
                                <v-col md="2" class="pa-2 text-center" style="border:1px solid #ccc; border-top:none;">{{ po.cost }}</v-col>
                                <v-col md="3" class="pa-2 text-center" style="border:1px solid #ccc; border-top:none;">{{ (po.qty_order * po.cost).toFixed(2) }}</v-col>
                            </v-row>

                        </v-card-text>
                    </div>

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
                { text: "Tgl PO Rilis", value: "tgl_po_rilis" },
                { text: "Total Amount ($)", value: "total_cost_usd" },
                { text: "Status", value: "status_po_buyer" },
                { text: "Actions", value: "actions" },
            ],
            bulan: [],
            tahun: [],
            buyer: [],
            pos: [],
            details: [],
            po: new FormData(),
            editId: "",
            buyerId: "",
            formPO: 
            { 
                id_buyer : null, nama_buyer: null, no_po: null, tgl_po_rilis: null, tgl_exfac_start:null, 
                tgl_exfac_end: null, kode_hangtag: null, total_qty_po: null, total_cost_usd: null, status: null
            },
            form: 
            {
                id_bulan: null,
                nama_bulan: null,
                id_tahun: null,
                nama_tahun: null,
                id_buyer: null,
                nama_buyer: null,
            },
        }
    },

    methods:
    {
        getBuyer() {
            var url = this.$api + "/buyer";
            this.$http.get(url)
                .then((response) => {
                this.buyer = response.data.data;
            })
        },

        readDataBulan() 
        {
            this.overlay = true;
            var url = this.$api + "/bulan/getAll";
            this.$http.get(url).then((response) => {
                    this.bulan = response.data.data; 
                })
            },

        readDataTahun() 
        {
            this.overlay = true;
            var url = this.$api + "/tahun/getAll";
            this.$http.get(url).then((response) => {
                    this.tahun= response.data.data; 
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

            var url2 = this.$api + "/detailpo/getByPO/" + item.no_po_buyer ;
            this.$http.get(url2)
                .then((response) => {
                this.details = response.data.data;
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

        closeDetail(){
            this.resetForm();
            this.readData();
            this.dialogDetail = false;
        },

        previewItem(item){
            this.editId = item.id_po_buyer;

            var url = this.$api + "/po/" + this.editId;
            this.$http.get(url)
                .then((response) => {
                this.pos = response.data.data;
            })

            var url2 = this.$api + "/detailpo/getByPO/" + item.no_po_buyer ;
            this.$http.get(url2)
                .then((response) => {
                this.details = response.data.data;
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

            this.invoicePreview = true
        },

        cetakInvoice() 
        {
            var report;
            var reportName = "";
            this.overlay = true;

            report = document.getElementById("InvoiceBuyer");
            reportName = "Invoice PO Buyer PT THE JAVA CREACRAFT";

            if (!report) 
            {
                console.error("InvoiceBuyer element not found");
                return;
            }

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
            this.invoicePreview = false;
            this.laporanPreview = false;
            location.reload();
        },

        async previewLaporan() 
        {
            if (this.checkForm() !== 0) 
            {
                this.color = "red";
                this.snackbar = true;
                this.error_message = 'Data Tidak Lengkap!!';
                return;
            }

            this.overlay = true;

            try 
            {
                const response = await this.$http.post(`${this.$api}/po/postBySearchData`, {
                    id_bulan: this.form.id_bulan,
                    nama_tahun: this.form.nama_tahun,
                    id_buyer: this.form.id_buyer
                });

                this.pos = response.data.data;

                if (this.pos && this.pos.length > 0) 
                {
                    this.laporanPreview = true;

                    var url = this.$api + "/buyer/" + this.form.id_buyer;
                    this.$http.get(url)
                        .then((response) => {
                         this.form.nama_buyer = response.data.data.nama_buyer;
                    })

                    var url1 = this.$api + "/bulan/"+ this.form.id_bulan;
                    this.$http.get(url1).then((response) => {
                        this.form.nama_bulan = response.data.data.nama_bulan; 
                    })

                } else 
                {
                    this.color = "orange";
                    this.snackbar = true;
                    this.error_message = "Data laporan tidak ditemukan.";
                }
            } catch (error) {
                console.error("Terjadi kesalahan:", error);
                this.color = "red";
                this.snackbar = true;
                this.error_message = error.response?.data?.message || "Gagal memuat data laporan";
            } finally {
                this.overlay = false;
            }
        },

        checkForm() 
        {
            if(this.form.nama_tahun === null)
            {
                return 1;
            }

            if(this.form.id_bulan === null)
            {
                return 1;
            }

            if(this.form.id_buyer === null)
            {
                return 1;
            }
                
                return 0;
        },

        cetakLaporan() 
        {
            var report;
            var reportName = "";
            this.overlay = true;

            report = document.getElementById("LaporanPOBuyer");
            reportName = "LAPORAN PO Buyer PT THE JAVA CREACRAFT";

            if (!report) 
            {
                console.error("LaporanPOBuyer element not found");
                return;
            }

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

        resetForm()
        {
            this.formPO =  
            { 
                id_buyer: null, nama_buyer: null, no_po: null, tgl_po_rilis: null, tgl_exfac_start:null, 
                tgl_exfac_end: null, kode_hangtag: null, total_qty_po: null, total_cost_usd: null, status: null
            };
            this.form = 
            {
                id_bulan: null,
                nama_bulan: null,
                id_tahun: null,
                nama_tahun: null,
                id_buyer: null,
                nama_buyer: null,
            };
        },
    },

    mounted()
    {
        this.readDataBulan();
        this.readDataTahun();
        this.readData();
        this.getBuyer();
        this.getColor();
    }
};
</script>