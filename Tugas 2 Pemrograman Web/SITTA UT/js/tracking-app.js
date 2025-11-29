// Aplikasi Vue untuk halaman tracking DO
const app = new Vue({
    el: '#app',
    data: {
        deliveryOrders: deliveryOrders,
        pengirimanList: pengirimanList,
        paket: paket,
        stok: stok,
        showModal: false,
        showDetailModal: false,
        showSuccessMessage: false,
        selectedDO: null,
        selectedPaket: null,
        formData: {
            nim: '',
            nama: '',
            ekspedisi: '',
            paketKode: '',
            tanggalKirim: ''
        }
    },
    methods: {
        formatCurrency(value) {
            return new Intl.NumberFormat('id-ID').format(value);
        },
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('id-ID', options);
        },
        generateDONumber() {
            const year = new Date().getFullYear();
            const sequence = this.deliveryOrders.length + 1;
            return `DO${year}-${sequence.toString().padStart(3, '0')}`;
        },
        getMataKuliahName(kode) {
            const item = this.stok.find(item => item.kode === kode);
            return item ? item.judul : 'Mata kuliah tidak ditemukan';
        },
        updatePaketDetails() {
            this.selectedPaket = this.paket.find(p => p.kode === this.formData.paketKode) || null;
        },
        showAddForm() {
            this.formData = {
                nim: '',
                nama: '',
                ekspedisi: '',
                paketKode: '',
                tanggalKirim: new Date().toISOString().split('T')[0]
            };
            this.selectedPaket = null;
            this.showModal = true;
            this.showSuccessMessage = false;
        },
        saveDO() {
            // Validasi
            if (!this.formData.nim || !this.formData.nama || !this.formData.ekspedisi || 
                !this.formData.paketKode || !this.formData.tanggalKirim) {
                alert('Harap isi semua field yang wajib diisi!');
                return;
            }

            const selectedPaket = this.paket.find(p => p.kode === this.formData.paketKode);
            if (!selectedPaket) {
                alert('Paket tidak valid!');
                return;
            }

            // Buat DO baru
            const newDO = {
                noDO: this.generateDONumber(),
                nim: this.formData.nim,
                nama: this.formData.nama,
                ekspedisi: this.formData.ekspedisi,
                paket: { ...selectedPaket },
                tanggalKirim: this.formData.tanggalKirim,
                totalHarga: selectedPaket.harga,
                status: "Dalam Perjalanan",
                perjalanan: [
                    { 
                        waktu: new Date().toLocaleString('id-ID'), 
                        keterangan: "Pesanan diterima dan sedang diproses" 
                    }
                ]
            };

            this.deliveryOrders.push(newDO);
            this.showSuccessMessage = true;
            
            setTimeout(() => {
                this.closeModal();
            }, 1500);
        },
        viewDetails(doItem) {
            this.selectedDO = doItem;
            this.showDetailModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.showSuccessMessage = false;
        },
        closeDetailModal() {
            this.showDetailModal = false;
            this.selectedDO = null;
        }
    }
});