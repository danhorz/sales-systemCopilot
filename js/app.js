import Customer from './models/Customer.js';
import Product from './models/Product.js';
import Sale from './models/Sale.js';

const formProductos = document.getElementById('form-productos');
const listaProductos = document.getElementById('lista-productos');
const formClientes = document.getElementById('form-clientes');
const listaClientes = document.getElementById('lista-clientes');
const formVentas = document.getElementById('form-ventas');
const clienteVenta = document.getElementById('cliente-venta');
const productosVenta = document.getElementById('productos-venta');
const totalVenta = document.getElementById('total-venta');
const listaVentas = document.getElementById('lista-ventas');
const agregarProductoBtn = document.getElementById('agregar-producto');
const nuevoProductoBtn = document.getElementById('nuevo-producto-btn');
const productForm = document.getElementById('productForm');
const closeProductFormBtn = document.getElementById('close-product-form');
const productsTableBody = document.querySelector('#productsTable tbody');

let productos = [];
let clientes = [];
let ventas = [];

formProductos.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre-producto').value;
    const precio = parseFloat(document.getElementById('precio-producto').value);
    const stock = parseInt(document.getElementById('stock-producto').value);

    const producto = new Product(nombre, precio, stock);
    productos.push(producto);
    actualizarListaProductos();
    actualizarSelectProductos();
    formProductos.reset();
    productForm.style.display = 'none';
});

formClientes.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre-cliente').value;
    const email = document.getElementById('email-cliente').value;

    const cliente = new Customer(nombre, email);
    clientes.push(cliente);
    actualizarListaClientes();
    actualizarSelectClientes();
    formClientes.reset();
});

formVentas.addEventListener('submit', (e) => {
    e.preventDefault();
    const clienteSeleccionado = clientes.find(cliente => cliente.name === clienteVenta.value);
    const venta = new Sale(clienteSeleccionado);

    const productosVentaDivs = productosVenta.querySelectorAll('.producto-venta');
    let ventaValida = true;

    productosVentaDivs.forEach(div => {
        const productoNombre = div.querySelector('select').value;
        const cantidad = parseInt(div.querySelector('input').value);
        const producto = productos.find(prod => prod.name === productoNombre);

        if (!venta.addProduct(producto, cantidad)) {
            ventaValida = false;
        }
    });

    if (ventaValida) {
        venta.confirmSale();
        ventas.push(venta);
        actualizarListaVentas();
        totalVenta.textContent = '0';
        productosVenta.innerHTML = '';
        formVentas.reset();
    } else {
        alert('Stock insuficiente para uno o más productos.');
    }
});

agregarProductoBtn.addEventListener('click', () => {
    const productoVentaDiv = document.createElement('div');
    productoVentaDiv.classList.add('producto-venta');

    const productoLabel = document.createElement('label');
    productoLabel.textContent = 'Producto:';
    productoVentaDiv.appendChild(productoLabel);

    const productoSelect = document.createElement('select');
    productoSelect.required = true;
    productos.forEach(producto => {
        const option = document.createElement('option');
        option.value = producto.name;
        option.textContent = producto.name;
        productoSelect.appendChild(option);
    });
    productoVentaDiv.appendChild(productoSelect);

    const cantidadLabel = document.createElement('label');
    cantidadLabel.textContent = 'Cantidad:';
    productoVentaDiv.appendChild(cantidadLabel);

    const cantidadInput = document.createElement('input');
    cantidadInput.type = 'number';
    cantidadInput.required = true;
    cantidadInput.addEventListener('input', actualizarTotalVenta);
    productoVentaDiv.appendChild(cantidadInput);

    productosVenta.appendChild(productoVentaDiv);
});

nuevoProductoBtn.addEventListener('click', () => {
    productForm.style.display = 'block';
});

closeProductFormBtn.addEventListener('click', () => {
    productForm.style.display = 'none';
});

function actualizarListaProductos() {
    listaProductos.innerHTML = '';
    productsTableBody.innerHTML = '';
    productos.forEach(producto => {
        const li = document.createElement('li');
        li.textContent = `${producto.name} - Precio: $${producto.price} - Stock: ${producto.stock}`;
        listaProductos.appendChild(li);

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${producto.name}</td>
            <td>${producto.price}</td>
            <td>${producto.stock}</td>
            <td><button class="btn btn-danger btn-sm">Eliminar</button></td>
        `;
        productsTableBody.appendChild(tr);
    });
}

function actualizarListaClientes() {
    listaClientes.innerHTML = '';
    clientes.forEach(cliente => {
        const li = document.createElement('li');
        li.textContent = `${cliente.name} - Email: ${cliente.email}`;
        listaClientes.appendChild(li);
    });
}

function actualizarSelectClientes() {
    clienteVenta.innerHTML = '';
    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.name;
        option.textContent = cliente.name;
        clienteVenta.appendChild(option);
    });
}

function actualizarSelectProductos() {
    const productoSelects = productosVenta.querySelectorAll('select');
    productoSelects.forEach(select => {
        select.innerHTML = '';
        productos.forEach(producto => {
            const option = document.createElement('option');
            option.value = producto.name;
            option.textContent = producto.name;
            select.appendChild(option);
        });
    });
}

function actualizarListaVentas() {
    listaVentas.innerHTML = '';
    ventas.forEach(venta => {
        const li = document.createElement('li');
        li.textContent = `Cliente: ${venta.customer.name} - Total: $${venta.total}`;
        listaVentas.appendChild(li);
    });
}

function actualizarTotalVenta() {
    let total = 0;
    const productosVentaDivs = productosVenta.querySelectorAll('.producto-venta');
    productosVentaDivs.forEach(div => {
        const productoNombre = div.querySelector('select').value;
        const cantidad = parseInt(div.querySelector('input').value);
        const producto = productos.find(prod => prod.name === productoNombre);
        if (producto) {
            total += producto.price * cantidad;
        }
    });
    totalVenta.textContent = total.toFixed(2);
}

// Búsqueda en tiempo real
document.querySelectorAll('input[data-table]').forEach(input => {
    input.addEventListener('input', (e) => {
        const tableId = e.target.dataset.table + 'Table';
        searchTable(tableId, e.target.value);
    });
});

function searchTable(tableId, searchText) {
    const table = document.getElementById(tableId);
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowText = Array.from(cells).map(cell => cell.textContent).join(' ');
        row.style.display = rowText.toLowerCase().includes(searchText.toLowerCase()) ? '' : 'none';
    });
}

// Ordenamiento por columnas
document.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', (e) => {
        const column = e.target.dataset.sort;
        const currentDir = e.target.classList.contains('sort-asc') 
            ? 'desc' 
            : 'asc';
            
        // Actualizar estados de ordenamiento
        document.querySelectorAll('th').forEach(el => 
            el.classList.remove('sort-asc', 'sort-desc')
        );
        e.target.classList.add(`sort-${currentDir}`);
        
        // Ordenar tabla
        const tableId = e.target.closest('table').id;
        sortTable(tableId, column, currentDir);
    });
});

function sortTable(tableId, column, direction) {
    const table = document.getElementById(tableId);
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const columnIndex = Array.from(table.querySelectorAll('th')).findIndex(th => th.dataset.sort === column);

    rows.sort((a, b) => {
        const aText = a.querySelectorAll('td')[columnIndex].textContent;
        const bText = b.querySelectorAll('td')[columnIndex].textContent;

        if (direction === 'asc') {
            return aText.localeCompare(bText, undefined, { numeric: true });
        } else {
            return bText.localeCompare(aText, undefined, { numeric: true });
        }
    });

    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}