// Aplikasi Vue untuk halaman stok
const app = new Vue({
    el: '#app',
    data: {
        stok: stok,
        upbjjList: upbjjList,
        kategoriList: kategoriList,
        filters: {
            upbjj: '',
            kategori: '',
            stokMenipis: false,
            stokKosong: false
        },
        filteredKategoriList: kategoriList,
        sortBy: 'judul',
        showModal: false,
        isEditing: false,
        showSuccessMessage: false,
        formData: {
            kode: '',
            judul: '',
            kategori: '',
            upbjj: '',
            lokasiRak: '',
            harga: 0,
            qty: 0,
            safety: 0,
            catatanHTML: ''
        },
        originalFormData: null
    },
    computed: {
        filteredAndSortedData() {
            let filtered = this.stok;
            
            //Filter berdasarkan UPBJJ
            if (this.filters.upbjj) {
                filtered = filtered.filter(item => item.upbjj === this.filters.upbjj);
            }
            
            // Filter berdasarkan Kategori
            if (this.filters.kategori) {
                filtered = filtered.filter(item => item.kategori === this.filters.kategori);
            }
            
            // Filter berdasarkan Status Stok Menipis
            if (this.filters.stokMenipis && !this.filters.stokKosong) {
                filtered = filtered.filter(item => item.qty < item.safety && item.qty > 0);
            }
            
            // Filter berdasarkan Status Stok Kosong
            if (this.filters.stokKosong && !this.filters.stokMenipis) {
                filtered = filtered.filter(item => item.qty === 0);
            }
            
            // Filter jika kedua checkbox dicentang
            if (this.filters.stokMenipis && this.filters.stokKosong) {
                filtered = filtered.filter(item => item.qty < item.safety || item.qty === 0);
            }
            
            // Sort data
            if (this.sortBy === 'judul') {
                filtered = filtered.sort((a, b) => a.judul.localeCompare(b.judul));
            } else if (this.sortBy === 'qty') {
                filtered = filtered.sort((a, b) => b.qty - a.qty);
            } else if (this.sortBy === 'upbjj') {
                filtered = filtered.sort((a, b) => a.upbjj.localeCompare(b.upbjj));
            } else if (this.sortBy === 'harga') {
                filtered = filtered.sort((a, b) => b.harga - a.harga);
            }
            
            return filtered;
        },
        totalStok() {
            return this.stok.reduce((total, item) => total + item.qty, 0);
        },
        stokMenipisCount() {
            return this.stok.filter(item => item.qty < item.safety && item.qty > 0).length;
        },
        stokKosongCount() {
            return this.stok.filter(item => item.qty === 0).length;
        }
    },
    methods: {
        formatCurrency(value) {
            return new Intl.NumberFormat('id-ID').format(value);
        },
        updateKategoriOptions() {
            if (this.filters.upbjj) {
                // Ambil kategori yang tersedia untuk UPBJJ yang dipilih
                const kategoriSet = new Set();
                this.stok
                    .filter(item => item.upbjj === this.filters.upbjj)
                    .forEach(item => kategoriSet.add(item.kategori));
                this.filteredKategoriList = Array.from(kategoriSet);
            } else {
                this.filteredKategoriList = this.kategoriList;
            }
            
            // Reset filter kategori jika tidak tersedia di UPBJJ yang dipilih
            if (this.filters.kategori && !this.filteredKategoriList.includes(this.filters.kategori)) {
                this.filters.kategori = '';
            }
        },
        resetFilters() {
            this.filters = {
                upbjj: '',
                kategori: '',
                stokMenipis: false,
                stokKosong: false
            };
            this.filteredKategoriList = this.kategoriList;
            this.sortBy = 'judul';
        },
        getStatusClass(item) {
            if (item.qty >= 50) {
                return 'status-aman';
            } else if (item.qty < 20) {
                return 'status-menipis';
            } else {
                return 'status-kosong';
            }
        },
        getStatusIcon(item) {
            if (item.qty >= item.safety) {
                return 'fas fa-check-circle';
            } else if (item.qty > 0) {
                return 'fas fa-exclamation-triangle';
            } else {
                return 'fas fa-times-circle';
            }
        },
        getStatusText(item) {
            if (item.qty >= item.safety) {
                return 'Aman';
            } else if (item.qty > 0) {
                return 'Menipis';
            } else {
                return 'Kosong';
            }
        },
        showAddForm() {
            this.isEditing = false;
            this.formData = {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: ''
            };
            this.showModal = true;
            this.showSuccessMessage = false;
        },
        editItem(item) {
            this.isEditing = true;
            this.formData = { ...item };
            this.originalFormData = { ...item };
            this.showModal = true;
            this.showSuccessMessage = false;
        },
        saveItem() {
            // Validasi sederhana
            if (!this.formData.kode || !this.formData.judul || !this.formData.kategori || 
                !this.formData.upbjj || !this.formData.lokasiRak || this.formData.harga < 0 || 
                this.formData.qty < 0 || this.formData.safety < 0) {
                alert('Harap isi semua field yang wajib diisi dengan nilai yang valid!');
                return;
            }

            if (this.isEditing) {
                // Update item yang ada
                const index = this.stok.findIndex(item => item.kode === this.originalFormData.kode);
                if (index !== -1) {
                    this.stok.splice(index, 1, { ...this.formData });
                }
            } else {
                // Tambah item baru
                // Cek apakah kode sudah ada
                const existingItem = this.stok.find(item => item.kode === this.formData.kode);
                if (existingItem) {
                    alert('Kode mata kuliah sudah ada!');
                    return;
                }
                this.stok.push({ ...this.formData });
            }
            
            this.showSuccessMessage = true;
            setTimeout(() => {
                this.closeModal();
            }, 1500);
        },
        closeModal() {
            this.showModal = false;
            this.showSuccessMessage = false;
        }
    }
});