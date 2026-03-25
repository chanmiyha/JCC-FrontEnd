<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5">Data Barang</h3>
        <v-card>
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
                <v-spacer>
                 
                </v-spacer>
                <v-btn color="success" dark @click="dialog = true">Tambah</v-btn>
            </v-card-title>

            <v-data-table
                :headers="headers"
                :items="barangs"
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
                    <span class="headline">Form Barang</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-select
                            v-model="formBarang.id_kategori"
                            label="Kategori"
                            :items="kategori"
                            item-text="nama_kategori"
                            item-value="id_kategori"
                            required
                        />
                        <v-text-field
                            v-model="formBarang.kode_barang"
                            label="Kode Barang"
                            placeholder="78-BNA0000"
                            required
                            clearable
                        ></v-text-field>

                        <v-text-field
                            v-model="formBarang.deskripsi_barang"
                            label="Deskripsi"
                            required
                            clearable
                        ></v-text-field>

                        <v-text-field
                            v-model="formBarang.ukuran_barang"
                            label="Ukuran"
                            hint="XL/L/M/S/XS"
                            required
                            clearable
                        ></v-text-field>

                        <v-row>
                            <v-col cols="12" sm="4">
                                <v-text-field
                                    v-model="formBarang.l_cm"
                                    label="L (cm)"
                                    type="number"
                                    required
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="4">
                                <v-text-field
                                    v-model="formBarang.w_cm"
                                    label="W (cm)"
                                    type="number"
                                    required
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="4">
                                <v-text-field
                                    v-model="formBarang.h_cm"
                                    label="HT (cm)"
                                    type="number"
                                    required
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-textarea
                            v-model="formBarang.detail_ukuran"
                            label="Detail Ukuran"
                            placeholder="Dia Top (cm) : 42
    Dia Bottom (cm): 50"
                            required
                        ></v-textarea>

                        <v-text-field
                            v-model="formBarang.material_barang"
                            label="Material"
                            hint="Banana bark/Waterhyacinth"
                            required
                            clearable
                        ></v-text-field>

                        <v-text-field
                            v-model="formBarang.colour_barang"
                            label="Colour"
                            hint="Natural/White wash"
                            required
                            clearable
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
                    <v-card-title class="justify-center font-weight-bold">
                        {{ detailBarang.kode_barang }}
                    </v-card-title>
                            
                    <v-card-subtitle>
                        {{ detailBarang.deskripsi_barang }}
                    </v-card-subtitle>
                            
                    <p>Kategori  : {{ detailBarang.nama_kategori }}</p>
                    <p>Size : {{ detailBarang.ukuran_barang }}</p>
                    
                    <p class="font-weight-bold">Ukuran cm</p>
                    <v-row>
                        <v-col cols="5" sm="4">
                            <p>L : {{ detailBarang.l_cm }}</p>
                        </v-col>

                        <v-col cols="5" sm="4">
                            <p>W : {{ detailBarang.w_cm }} </p>
                        </v-col>

                        <v-col cols="5" sm="4">
                            <p>H : {{ detailBarang.h_cm }}</p>
                        </v-col>
                    </v-row>

                    <p class="font-weight-bold">Ukuran inchi</p>
                    <v-row>
                        <v-col cols="5" sm="4">
                            <p>L : {{ detailBarang.l_inchi }}</p>
                        </v-col>

                        <v-col cols="5" sm="4">
                            <p>W : {{ detailBarang.w_inchi }} </p>
                        </v-col>

                        <v-col cols="5" sm="4">
                            <p>H : {{ detailBarang.h_inchi }}</p>
                        </v-col>
                    </v-row>
                    <p class="font-weight-bold">Detail Ukuran</p>
                    <p>{{ detailBarang.detail_ukuran }}</p>
                    <p>Material : {{ detailBarang.material_barang }}</p>
                    <p>Warna : {{ detailBarang.colour_barang }}</p>

                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDetail">Tutup</v-btn>
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
                    value: "id_barang",
                },
                { text: "Kode Barang", value: "kode_barang" },
                { text: "Deskripsi", value: "desc_barang" },
                { text: "Ukuran", value: "ukuran_barang" },
                { text: "Actions", value: "actions" },
            ],
            barangs: [],
            kategori: [],
            barang: new FormData(),
            editId: "",
            deleteId: "",
            formBarang: { kode_barang: null, deskripsi_barang: null, ukuran_barang: null, l_cm: null, 
                            w_cm: null,  h_cm: null, detail_ukuran: null, material_barang : null,
                            colour_barang: null, foto_barang: null, nama_kategori: null, id_kategori: null
                        },
            detailBarang: { kode_barang: null, deskripsi_barang: null, ukuran_barang: null, l_cm: null, l_inchi: null,
                            w_cm: null, w_inchi: null, h_cm: null, h_inchi: null, detail_ukuran: null, material_barang : null,
                            colour_barang: null,  nama_kategori: null, id_kategori: null
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

        getKategori() {
            var url = this.$api + "/kategori";
            this.$http.get(url)
                .then((response) => {
                this.kategori = response.data.data;
            })
        },

        readData() {
            var url = this.$api + "/barang";
            this.$http.get(url)
                .then((response) => {
                this.barangs = response.data.data;
            })
        },

        detailItem(item){
            this.editId = item.id_barang;

            var url = this.$api + "/barang/" + this.editId;
            this.$http.get(url)
                .then((response) => {
                this.barangs = response.data.data;
            })

            var url1 = this.$api + "/kategori/" + item.id_kategori;
            this.$http.get(url1)
                .then((response) => {
                this.detailBarang.nama_kategori = response.data.data.nama_kategori;
            })

            this.detailBarang.id_kategori = item.id_kategori;
            this.detailBarang.kode_barang = item.kode_barang;
            this.detailBarang.deskripsi_barang = item.desc_barang;
            this.detailBarang.ukuran_barang = item.ukuran_barang;
            this.detailBarang.l_cm = item.length_cm;
            this.detailBarang.l_inchi = item.length_inch;
            this.detailBarang.w_cm = item.width_cm;
            this.detailBarang.w_inchi = item.width_inch;
            this.detailBarang.h_cm = item.height_total_cm;
            this.detailBarang.h_inchi = item.height_total_inch;
            this.detailBarang.detail_ukuran = item.detail_ukuran;
            this.detailBarang.material_barang = item.material_barang;
            this.detailBarang.colour_barang = item.warna_barang;
            this.dialogDetail = true
        },
        
        save(){
            this.barang.append('id_kategori', this.formBarang.id_kategori);
            this.barang.append('kode_barang', this.formBarang.kode_barang);
            this.barang.append('desc_barang', this.formBarang.deskripsi_barang);
            this.barang.append('ukuran_barang', this.formBarang.ukuran_barang);
            this.barang.append('length_cm', this.formBarang.l_cm);
            this.barang.append('width_cm', this.formBarang.w_cm);
            this.barang.append('height_total_cm', this.formBarang.h_cm);
            this.barang.append('detail_ukuran', this.formBarang.detail_ukuran);
            this.barang.append('material_barang', this.formBarang.material_barang);
            this.barang.append('warna_barang', this.formBarang.colour_barang);

            var url = this.$api + "/barang";
            this.load = true;
            this.$http.post(url, this.barang)
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
                id_kategori: this.formBarang.id_kategori,
                kode_barang: this.formBarang.kode_barang,
                desc_barang: this.formBarang.deskripsi_barang,
                ukuran_barang: this.formBarang.ukuran_barang,
                length_cm: this.formBarang.l_cm,
                width_cm: this.formBarang.w_cm,
                height_total_cm: this.formBarang.h_cm,
                detail_ukuran: this.formBarang.detail_ukuran,
                material_barang: this.formBarang.material_barang,
                warna_barang: this.formBarang.colour_barang,
            };
            
            
            var url = this.$api + "/barang/" + this.editId;
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
            var url = this.$api + "/barang/" + this.deleteId;
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
            this.getKategori();
            this.editId = item.id_barang;
            this.formBarang.id_kategori = item.id_kategori;
            this.formBarang.kode_barang = item.kode_barang;
            this.formBarang.deskripsi_barang = item.desc_barang;
            this.formBarang.ukuran_barang = item.ukuran_barang;
            this.formBarang.l_cm = item.length_cm;
            this.l_cm = this.formBarang.l_cm;
            this.formBarang.w_cm = item.width_cm;
            this.w_cm = this.formBarang.w_cm;
            this.formBarang.h_cm = item.height_total_cm;
            this.h_cm = this.formBarang.h_cm;
            this.formBarang.detail_ukuran = item.detail_ukuran;
            this.formBarang.material_barang = item.material_barang;
            this.formBarang.colour_barang = item.warna_barang;

            this.formBarang.foto_barang = item.foto_barang;
            this.imagePreview = item.foto_barang 
                ? this.getImageUrl(item.foto_barang) 
                : require('../../assets/no_pict.jpg');
            
                    this.dialog = true;
                },

        deleteItem(item){
            this.deleteId = item.id_barang;
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
            this.formBarang =  
            { 
                kode_barang: null, deskripsi_barang: null, ukuran_barang: null, l_cm: null, 
                w_cm: null,  h_cm: null,  detail_ukuran: null, material_barang : null,
                colour_barang: null, foto_barang: null, nama_kategori: null, id_kategori: null
            };
        },

        previewImage() 
        {
            const file = this.formBarang.foto_barang;

            if (!file) 
            {
                this.imagePreview = require('@/assets/no_pict.jpg'); // fallback jika kosong
                return;
            }

            if (file instanceof File) 
            {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imagePreview = e.target.result;
                };
                reader.readAsDataURL(file);
            } else if (typeof file === 'string') 
            {
                this.imagePreview = `${this.$api}/${file}`;
            }
        },

        getImageUrl(url) 
        {
            if (url.startsWith('http')) 
            {
                return url;
            }
            return `${this.$api}/${url}`;
        },
    },

    mounted()
    {
        this.readData();
        this.getKategori();
    }
};
</script>
