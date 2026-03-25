<template>
    <v-main class="list" style="margin: auto;">
        <v-breadcrumbs
            :items="items"
            divider="/"
            style="margin-left:-25px; margin-top:-25px"
        />
        
        <div v-if="isWideScreen" style="margin-bottom: 5.5%">
            <h3 style="float:left">Laporan Transaksi Pangkalan</h3>
            <v-spacer />
        </div>

        <div v-else-if="isMediumScreen" style="margin-bottom: 12.5%">
            <h3 style="float:left">Laporan Transaksi Pangkalan</h3>
            <v-spacer />
        </div>

        <div v-else style="margin-bottom: 17.5%">
            <h3 style="float:left">Laporan Transaksi Pangkalan</h3>
            <v-spacer />
        </div>

        <v-card width="350px" style="background: #196b4d; border-radius: 4px 4px 0px 0px">
            <v-card-title>
                <h3 style="font-size:20px; color:#ffffff">Isilah Data di Bawah Ini:</h3>
            </v-card-title>
        </v-card>
        
        <v-card style="border-radius: 0px 0px 4px 4px;width:350px;height:">
            <v-card-text>
                <v-container v-if="isWideScreen" style="padding-left: 5px; padding-right: 5px; padding-bottom:47.5px">
                    <v-row style="margin-top:-30px">
                        <v-col 
                            cols="12"
                            md="7"
                        >
                            <v-select
                                :rules="bulanRules"
                                v-model="form.nomor_bulan"
                                :items="bulan"
                                item-text="nama_bulan"
                                item-value="id_bulan"
                                label="Bulan"
                            />
                        </v-col>
                        
                        <v-col
                            cols="6"
                            md="5"
                        >
                            <v-select
                                :rules="tahunRules"
                                v-model="form.tahun_transaksi"
                                :items="tahun"
                                item-text="nama_tahun"
                                item-value="nama_tahun"
                                label="Tahun"
                            />
                        </v-col>
                    </v-row>
                    
                    <v-select
                        :rules="pangkalanRules"
                        v-model="form.id_pangkalan"
                        :items="pangkalan"
                        item-text="nama_pangkalan"
                        item-value="id_pangkalan"
                        label="Pangkalan"
                        style="margin-top:-25px"
                    />

                    <v-btn small @click="prosesHandler" color="primary" dark style="float:left;margin-top:10px" >Proses</v-btn>
                    <v-spacer />
                    <v-btn small color="primary" dark style="float:left;margin-top:10px" class="ml-4" @click="resetData()">Reset</v-btn>
                </v-container>

                <v-container v-else style="padding-left: 5px; padding-right: 5px; padding-bottom:50px">
                    <v-select
                        v-model="form.nomor_bulan"
                        :items="bulan"
                        item-text="bulan_transaksi"
                        item-value="nomor_bulan"
                        label="Bulan"
                        style="margin-top:-12.5px"
                    />

                    <v-select
                        v-model="form.tahun_transaksi"
                        :items="tahun"
                        item-text="tahun_transaksi"
                        item-value="tahun_transaksi"
                        label="Tahun"
                        style="width:50%"
                    />

                    <v-select
                        v-model="form.id_pangkalan"
                        :items="pangkalan"
                        item-text="nama_pangkalan"
                        item-value="id_pangkalan"
                        label="Pangkalan"
                    />

                    <v-btn small @click="prosesHandler" color="primary" dark style="float:left;margin-top:10px">Proses</v-btn>
                    <v-spacer />
                    <v-btn small color="primary" dark style="float:left;margin-top:10px" class="ml-4" @click="resetData()">Reset</v-btn>
                </v-container>
            </v-card-text>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="1000px">
            <v-card height="20%" style="background: #196b4d; border-radius: 4px 4px 0px 0px">
                <v-card-title>
                    <h3 style="font-size:20px; color:#ffffff">Pratinjau</h3>
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

                    <span id="LaporanTransaksiPangkalan">
                        <v-card-text style="padding:30px; margin-top: 3%">
                            <h2 style="margin-top:7.5px;padding-bottom:40px">Laporan Transaksi Pangkalan Periode {{ form.bulan_transaksi }} Tahun {{ form.tahun_transaksi }}</h2>
                            <span style="float:left;">Nama Pangkalan</span> <span style="float:left;margin-left:40px">: </span> <span style="float:left;margin-left:3px"> {{form.nama_pangkalan}}</span> <br/>
                            <span style="float:left;">Alamat Pangkalan</span> <span style="float:left;margin-left:34px">: </span> <span style="float:left;margin-left:3px"> {{form.alamat_pangkalan}}</span> <br/><br/>
                            
                            <v-row no-gutters>
                                <v-col
                                    cols="6"
                                    md="1"
                                >
                                    <v-card
                                        class="pa-2"
                                        outlined
                                        tile
                                        style="text-align:center;"
                                    >
                                        <strong>No</strong>
                                    </v-card>
                                </v-col>

                                <v-col
                                    cols="6"
                                    md="2"
                                >
                                    <v-card
                                        class="pa-2"
                                        outlined
                                        tile
                                        style="text-align:center;"
                                    >
                                        <strong>Tanggal Pembelian</strong>
                                    </v-card>
                                </v-col>

                                <v-col
                                    cols="6"
                                    md="2"
                                >
                                    <v-card
                                        class="pa-2"
                                        outlined
                                        tile
                                        style="text-align:center;"
                                    >
                                        <strong>Jumlah Pembelian</strong>
                                    </v-card>
                                </v-col>

                                <v-col
                                    cols="6"
                                    md="3"
                                >
                                    <v-card
                                        class="pa-2"
                                        outlined
                                        tile
                                        style="text-align:center;"
                                    >
                                        <strong>Nama Pembeli</strong>
                                    </v-card>
                                </v-col>

                                <v-col
                                    cols="6"
                                    md="2"
                                >
                                    <v-card
                                        class="pa-2"
                                        outlined
                                        tile
                                        style="text-align:center;"
                                    >
                                        <strong>KTP Pembeli</strong>
                                    </v-card>
                                </v-col>
                                
                                <v-col
                                    cols="6"
                                    md="2"
                                >
                                    <v-card
                                        class="pa-2"
                                        outlined
                                        tile
                                        style="text-align:center;"
                                    >
                                        <strong>Kategori</strong>
                                    </v-card>
                                </v-col>
                            </v-row>

                            <v-row no-gutters
                                v-for="item in transaksi"
                                :key="item.id_transaksi"
                            >
                                <v-col
                                    cols="6"
                                    md="1"
                                >
                                    <v-card
                                        class="pa-2"
                                        outlined
                                        tile
                                        style="text-align:center;"
                                    >
                                        <span>{{item.no}}</span>
                                    </v-card>
                                </v-col>

                                <v-col
                                    cols="6"
                                    md="2"
                                >
                                    <v-card
                                        class="pa-2"
                                        outlined
                                        tile
                                        style="text-align:center;"
                                    >
                                        <span>{{item.tanggal_pembelian}}</span>
                                    </v-card>
                                </v-col>

                                <v-col
                                    cols="6"
                                    md="2"
                                >
                                    <v-card
                                        class="pa-2"
                                        outlined
                                        tile
                                        style="text-align:center;"
                                    >
                                        <span>{{item.jumlah_pembelian}}</span>
                                    </v-card>
                                </v-col>

                                <v-col
                                    cols="6"
                                    md="3"
                                >
                                    <v-card
                                        class="pa-2"
                                        outlined
                                        tile
                                        style="text-align:left;"
                                    >
                                        <span style="margin-left:5px">{{item.nama_pembeli}}</span>
                                    </v-card>
                                </v-col>

                                <v-col
                                    cols="6"
                                    md="2"
                                >
                                    <v-card
                                        class="pa-2"
                                        outlined
                                        tile
                                        style="text-align:left;"
                                    >
                                        <span style="margin-left:5px">{{item.ktp_pembeli}}</span>
                                    </v-card>
                                </v-col>

                                <v-col
                                    cols="6"
                                    md="2"
                                >
                                    <v-card
                                        class="pa-2"
                                        outlined
                                        tile
                                        style="text-align:left;"
                                    >
                                        <span style="margin-left:5px">{{item.kategori}}</span>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </span>
                </span>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>

        <v-overlay :value="overlay" class="align-center justify-center" style="Index: 100000">
            <v-progress-circular indeterminate size="64" />
        </v-overlay>
    </v-main>
</template>

<script>
    import html2canvas from 'html2canvas';
    import jsPDF from 'jspdf';
    import 'jspdf-autotable';

    export default {
        name: "LaporanTransaksiPangkalanPage",

        watch: {
            $route: {
                immediate: true,

                handler() {
                    document.title = "Laporan Transaksi Pangkalan";
                },
            },
        },

        data() {
            return {
                bulan: [],
                tahun: [],
                color: '',
                pangkalan: [],
                transaksi: [],
                dialog: false,
                overlay: false,
                snackbar: false,
                error_message: "",
                isWideScreen: window.innerWidth >= 1000,
                bulanRules: [(v) => !!v || "Bulan Tidak Boleh Kosong"],
                tahunRules: [(v) => !!v || "Tahun Tidak Boleh Kosong"],
                pangkalanRules: [(v) => !!v || "Pangkalan Tidak Boleh Kosong"],
                isMediumScreen: window.innerWidth>= 650 && window.innerWidth < 1000,
                items: [
                    { 
                        disabled: false,
                        text: "Dashboard",
                        href: '/dashboard-page',
                    },
                    { 
                        disabled: true,
                        text: "Laporan Transaksi Pangkalan",
                        href: '/laporan-transaksi-pangkalan-page',
                    },
                ],
                form: {
                    bulan_transaksi: null,
                    nomor_bulan: null,
                    tahun_transaksi: null,
                    id_pangkalan: null,
                    nama_pangkalan: null,
                    alamat_pangkalan: null,
                },
            }
        },

        methods: {
            close() {
                this.resetForm();
                this.dialog = false;
                location.reload();
            },

            readDataBulan() {
                this.overlay = true;
                var url = this.$api + "/bulan/getAll";
                this.$http.get(url)
                    .then((response) => {
                        if(response.data.code === 200)
                        {
                            this.bulan = response.data.data;
                            this.overlay = false;
                        }
                        else
                        {
                            this.color = "red";
                            this.snackbar = true;
                            this.overlay = false;
                            this.error_message = response.data.message;
                        }
                    })
                    .catch((error) => {
                        this.color = "red";
                        this.snackbar = true;
                        this.overlay = false;
                        this.error_message = error.response.data.message;
                    });
            },

            readDataTahun() {
                this.overlay = true;
                var url = this.$api + "/tahun/getAll";
                this.$http.get(url)
                    .then((response) => {
                        if(response.data.code === 200)
                        {
                            this.tahun= response.data.data;
                            this.overlay = false;
                        }
                        else
                        {
                            this.color = "red";
                            this.snackbar = true;
                            this.overlay = false;
                            this.error_message = response.data.message;
                        }
                    })
                    .catch((error) => {
                        this.color = "red";
                        this.snackbar = true;
                        this.overlay = false;
                        this.error_message = error.response.data.message;
                    });
            },

            readDataPangkalan() {
                this.overlay = false;
                var url = this.$api + "/pangkalan/getAll";
                this.$http.get(url)
                    .then((response) => {
                        if(response.data.code === 200)
                        {
                            this.pangkalan = response.data.data;
                            this.overlay = false;
                        }
                        else
                        {
                            this.color = "red";
                            this.snackbar = true;
                            this.overlay = false;
                            this.error_message = response.data.message;
                        }
                    })
                    .catch((error) => {
                        this.color = "red";
                        this.snackbar = true;
                        this.overlay = false;
                        this.error_message = error.response.data.message;
                    });
            },

            prosesHandler() {
                if(this.checkForm() === 0)
                {
                    this.overlay = true;

                    this.form.bulan_transaksi = this.getNamaBulan(this.form.nomor_bulan);
                    this.setDataPangkalan(this.form.id_pangkalan);
                    this.getDataReport();
                }
                else
                {
                    this.color = "red";
                    this.snackbar = true;
                    this.error_message = 'Data Tidak Lengkap!!';
                }
            },

            checkForm() {
                if(this.form.tahun === null)
                {
                    return 1;
                }

                if(this.form.nomor_bulan === null)
                {
                    return 1;
                }
                
                if(this.form.id_pangkalan === null)
                {
                    return 1;
                }
                
                return 0;
            },

            getDataReport(){
                var url = this.$api + "/transaksi/postBySearchData";
                var body = { 'bulan': this.form.nomor_bulan, 'tahun': this.form.tahun, 'id_pangkalan': this.form.id_pangkalan }
                this.$http.post(url, body)
                    .then((response) => {
                        if(response.data.code === 200)
                        {
                            this.transaksi = [];
                            let temp = response.data.data;

                            for(let i = 0; i < temp.length; i++)
                            {
                                this.transaksi.push(
                                    {
                                        no: parseInt(i) + parseInt(1), 
                                        id_transaksi: temp[i].id_transaksi, 
                                        nama_pembeli: temp[i].nama_pembeli, 
                                        kategori: temp[i].kategori_pembeli,
                                        ktp_pembeli: temp[i].nomor_ktp_pembeli, 
                                        jumlah_pembelian: temp[i].jumlah_pembelian, 
                                        tanggal_pembelian: temp[i].tanggal_transaksi, 
                                    }
                                )
                            }

                            this.overlay = false;
                            this.dialog=true;
                        }
                        else
                        {
                            this.color = "red";
                            this.snackbar = true;
                            this.overlay = false;
                            this.error_message = response.data.message;
                        }
                    })
                    .catch((error) => {
                        this.overlay = false;
                        console.log(error)

                        if(error.request.status === 404)
                        {
                            this.color = "red";
                            this.transaksi = [];
                            this.snackbar = true;
                            this.error_message = 'Data Transaksi Tidak Ditemukan';
                        }
                    });
            },

            setDataPangkalan(id_pangkalan){
                for(let i = 0; i < this.pangkalan.length; i++)
                {
                    if(id_pangkalan === this.pangkalan[i].id_pangkalan)
                    {
                        this.form.nama_pangkalan = this.pangkalan[i].nama_pangkalan;
                        this.form.alamat_pangkalan = this.pangkalan[i].alamat_pangkalan;
                    }
                }
            },

            getNamaBulan(nomor_bulan) {
                for(let i = 0; i < this.bulan.length; i++)
                {
                    if(nomor_bulan === this.bulan[i].id_bulan)
                    {
                        return this.bulan[i].nama_bulan;
                    }
                }
            },

            cetak() {
                var report;
                var reportName = "";
                this.overlay = true;

                report = document.getElementById("LaporanTransaksiPangkalan");
                reportName = "Laporan Transaksi Pangkalan_" + this.form.nama_pangkalan + "_" + this.form.bulan_transaksi + "_" + this.form.tahun_transaksi;

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
            
            resetData() {
                this.resetForm();
            },

            resetForm() {
                this.form = {
                    nomor_bulan: null,
                    id_pangkalan: null,
                    nama_pangkalan: null,
                    bulan_transaksi: null,
                    tahun_transaksi: null,
                    alamat_pangkalan: null,
                };
            },
        },

        mounted() {
            this.readDataBulan();
            this.readDataTahun();
            this.readDataPangkalan();
        }
    }
</script>

<style>
    .v-application p {
        padding-bottom: 0px !important;
    }

    .theme--light.v-sheet--outlined {
        border: thin solid #000000;
    }
</style>