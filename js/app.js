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

function actualizarListaProductos() {
    listaProductos.innerHTML = '';
    productos.forEach(producto => {
        const li = document.createElement('li');
        li.textContent = `${producto.name} - Precio: $${producto.price} - Stock: ${producto.stock}`;
        listaProductos.appendChild(li);
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