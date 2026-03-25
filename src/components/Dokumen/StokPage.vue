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
                <v-btn color="blue" dark @click="previewItem()">Preview Laporan</v-btn>
            </v-card-title>

            <v-data-table
                :headers="headers"
                :items="stoks"
                :search="search"
            >
            </v-data-table>
        </v-card>

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

                    <div id="LaporanStok">
                        <v-card-text style="padding:30px; margin-top: 3%">
                            <h2 style="margin-top:7.5px;padding-bottom:40px">LAPORAN STOK PT THE JAVA CREACRAFT</h2>
                            
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
                                        <strong>Tanggal Update</strong>
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
                                        <strong>Keterangan</strong>
                                    </v-card>
                                </v-col>
                            </v-row>

                            <v-row 
                                no-gutters 
                                align="stretch"
                                v-for="(item, index) in stoks"
                                :key="item.id_stok"
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
                                        <span>{{ item.jml_barang }}</span>
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
                                        <span style="margin-left:5px">{{ item.tgl_update }}</span>
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
                                        <span style="margin-left:5px">{{ item.keterangan_stok }}</span>
                                    </v-card>
                                </v-col>
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
    watch: {
            $route: {
                immediate: true,

                handler() {
                    document.title = "LAPORAN STOK";
                },
            },
        },

    name: "List",
    data()
    {
        return {
            load: false,
            snackbar: false,
            error_message: '',
            color: '',
            search: null,
            dialog: false,
            dialogPreview: false,
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
                { text: "Jumlah", value: "jml_barang" },
                { text: "Set/Pcs", value: "set_pcs" },
                { text: "Tanggal Update", value: "tgl_update" },
                { text: "Keterangan", value: "keterangan_stok" },
            ],
            stoks: [],
            barang: [],
            formStok: { kode_barang: null, jml_barang: null, set_pcs: null, tgl_update: null, keterangan_stok: null},
            stok: new FormData(),
        }
    },

    methods:
    {
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

        closeDetail(){
            this.resetForm();
            this.readData();
            this.dialogDetail = false;
        },

        previewItem(){
            var url = this.$api + "/stok";
            this.$http.get(url)
                .then((response) => {
                this.stoks = response.data.data;
                this.dialogPreview = true
            })
        },

        cetak() {
            var report;
            var reportName = "";
            this.overlay = true;

            report = document.getElementById("LaporanStok");
            reportName = "LAPORAN STOK PT THE JAVA CREACRAFT";

            if (!report) 
            {
                console.error("LaporanStok element not found");
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
            this.dialogPreview = false;
            location.reload();
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