/* ================================
   DATA SISTEM
================================ */

const state = {

    role: "wali",

    user: "Wali Murid",

    page: "dashboard",

    selectedBill: null,

    paymentMethod: "QRIS",

    bills: [

        {
            id: "TAG001",
            period: "Oktober 2026",
            amount: 150000,
            due: "10 Oktober 2026",
            status: "Belum Lunas"
        },

        {
            id: "TAG002",
            period: "September 2026",
            amount: 150000,
            due: "10 September 2026",
            status: "Lunas"
        },

        {
            id: "TAG003",
            period: "Agustus 2026",
            amount: 150000,
            due: "10 Agustus 2026",
            status: "Lunas"
        }

    ],

    payments: [

        {
            id: "PAY001",
            period: "September 2026",
            date: "05 September 2026",
            amount: 150000,
            method: "QRIS",
            status: "Berhasil"
        },

        {
            id: "PAY002",
            period: "Agustus 2026",
            date: "06 Agustus 2026",
            amount: 150000,
            method: "E-Wallet",
            status: "Berhasil"
        }

    ],

    notifications: [

        {
            title: "Pengingat Jatuh Tempo",
            text: "Tagihan SPP Oktober 2026 akan jatuh tempo pada 10 Oktober 2026."
        },

        {
            title: "Selamat Datang",
            text: "Selamat datang di Sistem Pembayaran SPP Digital."
        }

    ]

};


/* ================================
   FORMAT RUPIAH
================================ */

function rupiah(number) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(number);

}


/* ================================
   LOGIN
================================ */

document
    .getElementById("loginForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const role =
                document.getElementById("role").value;

            state.role = role;


            if (role === "wali") {

                state.user = "Wali Murid";

            }

            else if (role === "siswa") {

                state.user = "Aji Kuncoro";

            }

            else {

                state.user = "Bendahara / TU";

            }


            document
                .getElementById("loginPage")
                .classList.add("hidden");


            document
                .getElementById("appPage")
                .classList.remove("hidden");


            document
                .getElementById("sidebarName")
                .textContent =
                state.user;


            document
                .getElementById("topName")
                .textContent =
                state.user;


            document
                .getElementById("avatar")
                .textContent =
                state.user.charAt(0);


            document
                .getElementById("sidebarRole")
                .textContent =
                getRoleName();


            createNavigation();

            render();

        }
    );


/* ================================
   ROLE
================================ */

function getRoleName() {

    if (state.role === "wali") {

        return "Wali Murid";

    }

    if (state.role === "siswa") {

        return "Siswa";

    }

    return "Bendahara / TU";

}


/* ================================
   NAVIGATION
================================ */

function createNavigation() {

    let menus = [];


    if (
        state.role === "wali" ||
        state.role === "siswa"
    ) {

        menus = [

            {
                id: "dashboard",
                icon: "▦",
                name: "Dashboard"
            },

            {
                id: "tagihan",
                icon: "▤",
                name: "Tagihan SPP"
            },

            {
                id: "riwayat",
                icon: "◷",
                name: "Riwayat Pembayaran"
            },

            {
                id: "notifikasi",
                icon: "🔔",
                name: "Notifikasi"
            }

        ];

    }


    if (state.role === "bendahara") {

        menus = [

            {
                id: "dashboard",
                icon: "▦",
                name: "Dashboard"
            },

            {
                id: "tagihan",
                icon: "▤",
                name: "Kelola Tagihan"
            },

            {
                id: "transaksi",
                icon: "↔",
                name: "Transaksi"
            },

            {
                id: "tunggakan",
                icon: "!",
                name: "Data Tunggakan"
            },

            {
                id: "laporan",
                icon: "▥",
                name: "Laporan"
            }

        ];

    }


    document
        .getElementById("navigation")
        .innerHTML = menus
        .map(
            function(menu) {

                return `

                    <button
                        class="${
                            state.page === menu.id
                                ? "active"
                                : ""
                        }"

                        onclick="goTo('${menu.id}')"
                    >

                        ${menu.icon}

                        &nbsp;

                        ${menu.name}

                    </button>

                `;

            }
        )
        .join("");

}


/* ================================
   PINDAH HALAMAN
================================ */

function goTo(page) {

    state.page = page;

    createNavigation();

    render();

    document
        .querySelector(".sidebar")
        .classList.remove("open");

}


/* ================================
   RENDER
================================ */

function render() {

    const titles = {

        dashboard: "Dashboard",

        tagihan:
            state.role === "bendahara"
                ? "Kelola Tagihan"
                : "Tagihan SPP",

        riwayat:
            "Riwayat Pembayaran",

        notifikasi:
            "Notifikasi",

        transaksi:
            "Transaksi Pembayaran",

        tunggakan:
            "Data Tunggakan",

        laporan:
            "Laporan Pembayaran"

    };


    document
        .getElementById("pageTitle")
        .textContent =
        titles[state.page];


    const content =
        document.getElementById("content");


    switch (state.page) {

        case "dashboard":

            content.innerHTML =
                dashboard();

            break;


        case "tagihan":

            content.innerHTML =
                tagihanPage();

            break;


        case "riwayat":

            content.innerHTML =
                historyPage();

            break;


        case "notifikasi":

            content.innerHTML =
                notificationPage();

            break;


        case "transaksi":

            content.innerHTML =
                transactionPage();

            break;


        case "tunggakan":

            content.innerHTML =
                arrearsPage();

            break;


        case "laporan":

            content.innerHTML =
                reportPage();

            break;

    }

}


/* ================================
   DASHBOARD
================================ */

function dashboard() {

    if (state.role === "bendahara") {

        return adminDashboard();

    }


    const unpaid =
        state.bills
            .filter(
                bill =>
                    bill.status !== "Lunas"
            )
            .reduce(
                (total, bill) =>
                    total + bill.amount,
                0
            );


    return `

        <div class="welcome">

            <div>

                <h3>
                    Halo, ${state.user} 👋
                </h3>

                <p class="muted">
                    Pantau tagihan dan pembayaran SPP
                    dari satu tempat.
                </p>

            </div>

            <button
                class="btn btn-pay"
                onclick="goTo('tagihan')"
            >
                Lihat Tagihan
            </button>

        </div>


        <div class="stats">

            <div class="stat">

                <div class="stat-label">
                    Total Tagihan Aktif
                </div>

                <div class="stat-value">
                    ${rupiah(unpaid)}
                </div>

                <div class="stat-trend">
                    Perlu dibayar
                </div>

            </div>


            <div class="stat">

                <div class="stat-label">
                    Tagihan Lunas
                </div>

                <div class="stat-value">

                    ${
                        state.bills.filter(
                            b => b.status === "Lunas"
                        ).length
                    }

                </div>

                <div class="stat-trend">
                    Periode selesai
                </div>

            </div>


            <div class="stat">

                <div class="stat-label">
                    Riwayat Transaksi
                </div>

                <div class="stat-value">
                    ${state.payments.length}
                </div>

                <div class="stat-trend">
                    Transaksi tercatat
                </div>

            </div>


            <div class="stat">

                <div class="stat-label">
                    Status Siswa
                </div>

                <div class="stat-value">
                    Aktif
                </div>

                <div class="stat-trend">
                    Data terhubung
                </div>

            </div>

        </div>


        <div class="grid-2">

            <div class="card">

                <h3>
                    Tagihan Terbaru
                </h3>

                ${billTable(3)}

            </div>


            <div class="card">

                <h3>
                    Pengingat
                </h3>

                ${notificationList()}

            </div>

        </div>

    `;

}


/* ================================
   DASHBOARD BENDAHARA
================================ */

function adminDashboard() {

    const total =
        state.payments.reduce(
            (sum, payment) =>
                sum + payment.amount,
            0
        );


    return `

        <div class="welcome">

            <div>

                <h3>
                    Dashboard Bendahara
                </h3>

                <p class="muted">
                    Pantau transaksi, tunggakan,
                    dan pembayaran SPP.
                </p>

            </div>

            <button
                class="btn btn-pay"
                onclick="goTo('laporan')"
            >
                Lihat Laporan
            </button>

        </div>


        <div class="stats">

            <div class="stat">

                <div class="stat-label">
                    Kas Masuk
                </div>

                <div class="stat-value">
                    ${rupiah(total)}
                </div>

                <div class="stat-trend">
                    Total pembayaran
                </div>

            </div>


            <div class="stat">

                <div class="stat-label">
                    Transaksi
                </div>

                <div class="stat-value">
                    ${state.payments.length}
                </div>

                <div class="stat-trend">
                    Transaksi tercatat
                </div>

            </div>


            <div class="stat">

                <div class="stat-label">
                    Tunggakan
                </div>

                <div class="stat-value">

                    ${
                        state.bills.filter(
                            b => b.status !== "Lunas"
                        ).length
                    }

                </div>

                <div class="stat-trend">
                    Perlu dipantau
                </div>

            </div>


            <div class="stat">

                <div class="stat-label">
                    Status Sistem
                </div>

                <div class="stat-value">
                    Aktif
                </div>

                <div class="stat-trend">
                    Sistem berjalan
                </div>

            </div>

        </div>


        <div class="card">

            <h3>
                Transaksi Terbaru
            </h3>

            ${paymentTable()}

        </div>

    `;

}


/* ================================
   TAGIHAN
================================ */

function tagihanPage() {

    return `

        <div class="page-head">

            <div>

                <h3>
                    ${
                        state.role === "bendahara"
                            ? "Kelola Tagihan SPP"
                            : "Tagihan SPP"
                    }
                </h3>

                <p class="muted">
                    Informasi tagihan dan status pembayaran.
                </p>

            </div>

        </div>


        <div class="notice">

            Pembayaran tersedia melalui
            QRIS, E-Wallet, dan Virtual Account.

        </div>


        <div class="card">

            ${billTable()}

        </div>

    `;

}


/* ================================
   TABEL TAGIHAN
================================ */

function billTable(limit = 99) {

    const bills =
        state.bills.slice(0, limit);


    const rows =
        bills.map(
            function(bill) {

                let action;


                if (
                    bill.status === "Lunas"
                ) {

                    action = `

                        <button
                            class="btn btn-receipt"
                            onclick="showReceipt('${bill.id}')"
                        >
                            Kuitansi
                        </button>

                    `;

                }

                else {

                    action = `

                        <button
                            class="btn btn-pay"
                            onclick="openPayment('${bill.id}')"
                        >
                            Bayar
                        </button>

                    `;

                }


                return `

                    <tr>

                        <td>
                            ${bill.period}
                        </td>

                        <td>
                            ${rupiah(bill.amount)}
                        </td>

                        <td>
                            ${bill.due}
                        </td>

                        <td>

                            <span
                                class="status ${
                                    bill.status === "Lunas"
                                        ? "lunas"
                                        : "belum"
                                }"
                            >
                                ${bill.status}
                            </span>

                        </td>

                        <td>
                            ${action}
                        </td>

                    </tr>

                `;

            }
        ).join("");


    return `

        <div class="table-container">

            <table>

                <thead>

                    <tr>

                        <th>
                            Periode
                        </th>

                        <th>
                            Nominal
                        </th>

                        <th>
                            Jatuh Tempo
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Aksi
                        </th>

                    </tr>

                </thead>

                <tbody>

                    ${rows}

                </tbody>

            </table>

        </div>

    `;

}


/* ================================
   RIWAYAT
================================ */

function historyPage() {

    return `

        <div class="page-head">

            <div>

                <h3>
                    Riwayat Pembayaran
                </h3>

                <p class="muted">
                    Daftar transaksi pembayaran.
                </p>

            </div>

        </div>


        <div class="card">

            ${paymentTable()}

        </div>

    `;

}


/* ================================
   TABEL PEMBAYARAN
================================ */

function paymentTable() {

    const rows =
        state.payments.map(
            function(payment) {

                return `

                    <tr>

                        <td>
                            ${payment.id}
                        </td>

                        <td>
                            ${payment.period}
                        </td>

                        <td>
                            ${payment.date}
                        </td>

                        <td>
                            ${rupiah(payment.amount)}
                        </td>

                        <td>
                            ${payment.method}
                        </td>

                        <td>

                            <span class="status lunas">
                                ${payment.status}
                            </span>

                        </td>

                    </tr>

                `;

            }
        ).join("");


    return `

        <div class="table-container">

            <table>

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Periode</th>
                        <th>Tanggal</th>
                        <th>Nominal</th>
                        <th>Metode</th>
                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    ${rows}

                </tbody>

            </table>

        </div>

    `;

}


/* ================================
   NOTIFIKASI
================================ */

function notificationPage() {

    return `

        <div class="page-head">

            <div>

                <h3>
                    Notifikasi
                </h3>

                <p class="muted">
                    Informasi dan pengingat pembayaran.
                </p>

            </div>

        </div>


        <div class="card">

            ${notificationList()}

        </div>

    `;

}


function notificationList() {

    return state.notifications
        .map(
            function(notification) {

                return `

                    <div class="notification-item">

                        <strong>
                            ${notification.title}
                        </strong>

                        <p>
                            ${notification.text}
                        </p>

                    </div>

                `;

            }
        )
        .join("");

}


/* ================================
   TRANSAKSI
================================ */

function transactionPage() {

    return `

        <div class="page-head">

            <div>

                <h3>
                    Transaksi Pembayaran
                </h3>

                <p class="muted">
                    Pemantauan transaksi pembayaran SPP.
                </p>

            </div>

        </div>


        <div class="card">

            ${paymentTable()}

        </div>

    `;

}


/* ================================
   TUNGGAKAN
================================ */

function arrearsPage() {

    const arrears =
        state.bills.filter(
            bill =>
                bill.status !== "Lunas"
        );


    const rows =
        arrears.map(
            function(bill) {

                return `

                    <tr>

                        <td>
                            2025001
                        </td>

                        <td>
                            Aji Kuncoro
                        </td>

                        <td>
                            ${bill.period}
                        </td>

                        <td>
                            ${rupiah(bill.amount)}
                        </td>

                        <td>
                            ${bill.due}
                        </td>

                        <td>

                            <span class="status belum">
                                Belum Lunas
                            </span>

                        </td>

                    </tr>

                `;

            }
        ).join("");


    return `

        <div class="page-head">

            <div>

                <h3>
                    Data Tunggakan
                </h3>

                <p class="muted">
                    Daftar tagihan yang belum dibayar.
                </p>

            </div>

        </div>


        <div class="card">

            ${
                rows

                    ? `

                        <div class="table-container">

                            <table>

                                <thead>

                                    <tr>

                                        <th>NIS</th>
                                        <th>Siswa</th>
                                        <th>Periode</th>
                                        <th>Nominal</th>
                                        <th>Jatuh Tempo</th>
                                        <th>Status</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    ${rows}

                                </tbody>

                            </table>

                        </div>

                    `

                    : `

                        <p class="muted">
                            Tidak ada tunggakan.
                        </p>

                    `
            }

        </div>

    `;

}


/* ================================
   LAPORAN
================================ */

function reportPage() {

    const total =
        state.payments.reduce(
            (sum, payment) =>
                sum + payment.amount,
            0
        );


    return `

        <div class="page-head">

            <div>

                <h3>
                    Laporan Pembayaran
                </h3>

                <p class="muted">
                    Rekap pembayaran SPP.
                </p>

            </div>

            <button
                class="btn btn-pay"
                onclick="downloadReport()"
            >
                Unduh Laporan
            </button>

        </div>


        <div class="stats">

            <div class="stat">

                <div class="stat-label">
                    Total Kas
                </div>

                <div class="stat-value">
                    ${rupiah(total)}
                </div>

            </div>


            <div class="stat">

                <div class="stat-label">
                    Total Transaksi
                </div>

                <div class="stat-value">
                    ${state.payments.length}
                </div>

            </div>


            <div class="stat">

                <div class="stat-label">
                    Tunggakan
                </div>

                <div class="stat-value">

                    ${
                        state.bills.filter(
                            b => b.status !== "Lunas"
                        ).length
                    }

                </div>

            </div>


            <div class="stat">

                <div class="stat-label">
                    Tahun
                </div>

                <div class="stat-value">
                    2026
                </div>

            </div>

        </div>


        <div class="card">

            <h3>
                Rekap Transaksi
            </h3>

            ${paymentTable()}

        </div>

    `;

}


/* ================================
   PEMBAYARAN
================================ */

function openPayment(id) {

    state.selectedBill =
        state.bills.find(
            bill =>
                bill.id === id
        );


    document
        .getElementById("paymentInfo")
        .textContent =

        `${state.selectedBill.period}
        • ${rupiah(state.selectedBill.amount)}
        • Jatuh tempo ${state.selectedBill.due}`;


    document
        .getElementById("paymentModal")
        .classList.remove("hidden");

}


function closePayment() {

    document
        .getElementById("paymentModal")
        .classList.add("hidden");

}


/* ================================
   KONFIRMASI PEMBAYARAN
================================ */

function confirmPayment() {

    const bill =
        state.selectedBill;


    if (!bill) {

        return;

    }


    bill.status = "Lunas";


    const newPayment = {

        id:
            "PAY" +
            Math.floor(
                Math.random() * 9000
            ),

        period:
            bill.period,

        date:
            new Date()
                .toLocaleDateString("id-ID"),

        amount:
            bill.amount,

        method:
            state.paymentMethod,

        status:
            "Berhasil"

    };


    state.payments.unshift(
        newPayment
    );


    state.notifications.unshift({

        title:
            "Pembayaran Berhasil",

        text:
            `Pembayaran ${bill.period}
            telah berhasil diproses.`

    });


    closePayment();


    showToast(
        "Pembayaran berhasil!"
    );


    render();

}


/* ================================
   KUITANSI
================================ */

function showReceipt(id) {

    const bill =
        state.bills.find(
            b =>
                b.id === id
        );


    const payment =
        state.payments.find(
            p =>
                p.period === bill.period
        );


    document
        .getElementById("content")
        .innerHTML = `

            <div class="page-head">

                <div>

                    <h3>
                        Kuitansi Digital
                    </h3>

                    <p class="muted">
                        Bukti pembayaran SPP.
                    </p>

                </div>

                <button
                    class="btn btn-pay"
                    onclick="downloadReceipt('${bill.id}')"
                >
                    Unduh Kuitansi
                </button>

            </div>


            <div class="card">

                <div class="receipt">

                    <h3>
                        KUITANSI PEMBAYARAN SPP
                    </h3>


                    <div class="receipt-row">

                        <span>
                            Nomor
                        </span>

                        <strong>
                            ${payment?.id || "PAY-DEMO"}
                        </strong>

                    </div>


                    <div class="receipt-row">

                        <span>
                            Nama Siswa
                        </span>

                        <strong>
                            Aji Kuncoro
                        </strong>

                    </div>


                    <div class="receipt-row">

                        <span>
                            NIS
                        </span>

                        <strong>
                            2025001
                        </strong>

                    </div>


                    <div class="receipt-row">

                        <span>
                            Periode
                        </span>

                        <strong>
                            ${bill.period}
                        </strong>

                    </div>


                    <div class="receipt-row">

                        <span>
                            Nominal
                        </span>

                        <strong>
                            ${rupiah(bill.amount)}
                        </strong>

                    </div>


                    <div class="receipt-row">

                        <span>
                            Metode
                        </span>

                        <strong>
                            ${payment?.method || "QRIS"}
                        </strong>

                    </div>


                    <div class="receipt-row">

                        <span>
                            Status
                        </span>

                        <strong>
                            LUNAS
                        </strong>

                    </div>

                </div>

            </div>

        `;


    document
        .getElementById("pageTitle")
        .textContent =
        "Kuitansi Digital";

}


/* ================================
   DOWNLOAD KUITANSI
================================ */

function downloadReceipt(id) {

    const bill =
        state.bills.find(
            b =>
                b.id === id
        );


    const text = `

KUITANSI PEMBAYARAN SPP

Nama Siswa : Aji Kuncoro
NIS        : 2025001
Periode    : ${bill.period}
Nominal    : ${rupiah(bill.amount)}
Status     : LUNAS

Terima kasih.

`;


    downloadFile(
        text,
        "kuitansi-spp.txt"
    );

}


/* ================================
   DOWNLOAD LAPORAN
================================ */

function downloadReport() {

    let text =
        "LAPORAN PEMBAYARAN SPP\n\n";


    state.payments.forEach(
        function(payment) {

            text +=

                `${payment.id} | ` +
                `${payment.period} | ` +
                `${payment.date} | ` +
                `${rupiah(payment.amount)} | ` +
                `${payment.method} | ` +
                `${payment.status}\n`;

        }
    );


    downloadFile(
        text,
        "laporan-pembayaran-spp.txt"
    );

}


/* ================================
   DOWNLOAD FILE
================================ */

function downloadFile(
    text,
    filename
) {

    const blob =
        new Blob(
            [text],
            {
                type: "text/plain"
            }
        );


    const link =
        document.createElement("a");


    link.href =
        URL.createObjectURL(blob);


    link.download =
        filename;


    link.click();

}


/* ================================
   NOTIFIKASI
================================ */

function showNotifications() {

    const existing =
        document.querySelector(
            ".notification-popup"
        );


    if (existing) {

        existing.remove();

        return;

    }


    const popup =
        document.createElement("div");


    popup.className =
        "notification-popup";


    popup.innerHTML = `

        <h3>
            Notifikasi
        </h3>

        ${notificationList()}

    `;


    popup.style.position =
        "fixed";

    popup.style.right =
        "25px";

    popup.style.top =
        "70px";

    popup.style.width =
        "320px";

    popup.style.background =
        "white";

    popup.style.border =
        "1px solid #e7ebf1";

    popup.style.borderRadius =
        "15px";

    popup.style.padding =
        "15px";

    popup.style.boxShadow =
        "0 15px 40px rgba(0,0,0,.12)";

    popup.style.zIndex =
        "100";


    document.body.appendChild(
        popup
    );

}


/* ================================
   TOAST
================================ */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        function() {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );

}


/* ================================
   LOGOUT
================================ */

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        function() {

            document
                .getElementById("appPage")
                .classList.add("hidden");


            document
                .getElementById("loginPage")
                .classList.remove("hidden");


            state.page =
                "dashboard";

        }
    );


/* ================================
   MOBILE MENU
================================ */

document
    .getElementById("mobileMenu")
    .addEventListener(
        "click",
        function() {

            document
                .querySelector(".sidebar")
                .classList.toggle(
                    "open"
                );

        }
    );


/* ================================
   METODE PEMBAYARAN
================================ */

document
    .querySelectorAll(".method")
    .forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    document
                        .querySelectorAll(".method")
                        .forEach(
                            function(item) {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );


                    state.paymentMethod =
                        button.dataset.method;

                }
            );

        }
    );