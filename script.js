/* script.js
   Shared script for index.html and admin.html
   - Stores vehicles in localStorage key: 'monguno_vehicles'
   - Admin password (client-side) : "Abbakasim"
*/

const STORAGE_KEY = 'monguno_vehicles';
const ADMIN_PASSWORD = 'Abbakasim'; // your admin password

/* -------- default demo data -------- */
const DEMO_VEHICLES = [
  { id:1, make:"Toyota", model:"Camry", year:2022, price:8500000, type:"Sedan", image:"https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1000&q=80", features:{transmission:"Automatic",fuel:"Petrol",seats:5,color:"White"} },
  { id:2, make:"Honda", model:"CR-V", year:2021, price:10500000, type:"SUV", image:"https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1000&q=80", features:{transmission:"Automatic",fuel:"Petrol",seats:5,color:"Black"} },
  { id:3, make:"Ford", model:"Ranger", year:2020, price:9500000, type:"Truck", image:"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80", features:{transmission:"Manual",fuel:"Diesel",seats:5,color:"Blue"} },
  { id:4, make:"BMW", model:"X5", year:2023, price:25000000, type:"SUV", image:"https://images.unsplash.com/photo-1592533564774-23f6b3b5a7a2?auto=format&fit=crop&w=1000&q=80", features:{transmission:"Automatic",fuel:"Petrol",seats:5,color:"Gray"} },
  { id:5, make:"Toyota", model:"Corolla", year:2021, price:7200000, type:"Sedan", image:"https://images.unsplash.com/photo-1616627456194-a98a9b2f9f2e?auto=format&fit=crop&w=1000&q=80", features:{transmission:"Automatic",fuel:"Petrol",seats:5,color:"Red"} },
  { id:6, make:"Mercedes", model:"C-Class", year:2022, price:22000000, type:"Sedan", image:"https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1000&q=80", features:{transmission:"Automatic",fuel:"Petrol",seats:5,color:"Black"} }
];

/* -------- storage helpers -------- */
function loadVehicles(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return DEMO_VEHICLES.slice();
    const parsed = JSON.parse(raw);
    if(Array.isArray(parsed) && parsed.length) return parsed;
    return DEMO_VEHICLES.slice();
  } catch(e){
    console.warn('loadVehicles error', e);
    return DEMO_VEHICLES.slice();
  }
}
function saveVehicles(list){
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); return true; }
  catch(e){ console.error('saveVehicles failed', e); return false; }
}

/* -------- utility -------- */
function formatPrice(n){
  return new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(n);
}

/* -------- index page functions -------- */
function renderVehiclesGrid(list){
  const grid = document.getElementById('vehiclesGrid');
  if(!grid) return;
  grid.innerHTML = '';
  if(!list.length){
    grid.innerHTML = '<div class="card center">No vehicles match your filters</div>';
    return;
  }
  list.forEach(v=>{
    const card = document.createElement('div');
    card.className = 'vehicle-card';
    card.innerHTML = `
      <img class="vehicle-img" src="${v.image}" alt="${v.make} ${v.model}">
      <div class="vehicle-details">
        <div class="vehicle-title">${v.year} ${v.make} ${v.model}</div>
        <div class="vehicle-price">${formatPrice(v.price)}</div>
        <div class="vehicle-features">
          <span title="Transmission"><i class="fas fa-cog"></i> ${v.features.transmission || '-'}</span>
          <span title="Fuel"><i class="fas fa-gas-pump"></i> ${v.features.fuel || '-'}</span>
          <span title="Seats"><i class="fas fa-user"></i> ${v.features.seats || '-'}</span>
        </div>
        <div style="margin-top:12px"><button class="btn" style="width:100%" onclick="handleView(${v.id})">View Details</button></div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function populateFilters(vehicles){
  const makeSelect = document.getElementById('makeFilter');
  const typeSelect = document.getElementById('typeFilter');
  if(!makeSelect || !typeSelect) return;
  const makes = Array.from(new Set(vehicles.map(v=>v.make))).sort();
  const types = Array.from(new Set(vehicles.map(v=>v.type))).sort();
  makeSelect.innerHTML = '<option value="">All Makes</option>';
  typeSelect.innerHTML = '<option value="">All Types</option>';
  makes.forEach(m=> makeSelect.insertAdjacentHTML('beforeend', `<option value="${m}">${m}</option>`));
  types.forEach(t=> typeSelect.insertAdjacentHTML('beforeend', `<option value="${t}">${t}</option>`));
}

function applyFilters(){
  let list = loadVehicles();
  const make = document.getElementById('makeFilter')?.value;
  const type = document.getElementById('typeFilter')?.value;
  const price = document.getElementById('priceFilter')?.value;
  const year = document.getElementById('yearFilter')?.value;

  if(make) list = list.filter(v=> v.make === make);
  if(type) list = list.filter(v=> v.type === type);

  if(price){
    const [minStr,maxStr] = price.split('-');
    const min = minStr ? parseInt(minStr,10) : null;
    const max = maxStr ? parseInt(maxStr,10) : null;
    list = list.filter(v=>{
      if(min && v.price < min) return false;
      if(max && v.price > max) return false;
      return true;
    });
  }

  if(year){
    if(year === '2009'){ list = list.filter(v=> v.year <= 2009); }
    else {
      const parts = year.split('-').map(x=>parseInt(x,10));
      if(parts.length === 2) list = list.filter(v=> v.year >= parts[0] && v.year <= parts[1]);
    }
  }

  renderVehiclesGrid(list);
}

window.handleView = function(id){
  alert('Vehicle details for ID: ' + id + ' (placeholder). You can extend this to a modal or details page.');
}

/* -------- admin page functions -------- */
function renderAdminList(){
  const container = document.getElementById('vehicleList');
  if(!container) return;
  const list = loadVehicles();
  container.innerHTML = '';
  list.forEach(v=>{
    const row = document.createElement('div');
    row.style.display='flex'; row.style.justifyContent='space-between'; row.style.alignItems='center';
    row.style.padding='8px'; row.style.borderBottom='1px solid #eee';
    row.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px">
        <img src="${v.image}" alt="" style="width:90px;height:60px;object-fit:cover;border-radius:6px">
        <div>
          <div style="font-weight:700">${v.year} ${v.make} ${v.model}</div>
          <div style="font-size:13px;color:#666">${v.type} • ${formatPrice(v.price)}</div>
        </div>
      </div>
      <div style="display:flex;gap:6px">
        <button class="btn outline" onclick="adminEdit(${v.id})"><i class="fas fa-pen"></i></button>
        <button class="btn" onclick="adminDelete(${v.id})"><i class="fas fa-trash"></i></button>
      </div>
    `;
    container.appendChild(row);
  });
}

let ADMIN_UNLOCKED = false;
let EDIT_ID = null;

function adminUnlock(){
  const pass = document.getElementById('adminPass')?.value || document.getElementById('adminPassInput')?.value;
  if(pass === ADMIN_PASSWORD){
    ADMIN_UNLOCKED = true;
    document.getElementById('adminStatus')?.textContent = 'Unlocked';
    document.getElementById('unlockBtn')?.style.display='none';
    document.getElementById('lockBtn')?.style.display='inline-block';
    enableAdminControls(true);
    alert('Admin unlocked');
  } else {
    alert('Wrong password');
  }
}

function adminLock(){
  ADMIN_UNLOCKED = false;
  document.getElementById('adminStatus')?.textContent = '';
  document.getElementById('unlockBtn')?.style.display='inline-block';
  document.getElementById('lockBtn')?.style.display='none';
  enableAdminControls(false);
  clearAdminForm();
}

function enableAdminControls(enable){
  const ids = ['make','model','year','price','type','image','transmission','fuel','seats','saveVehicle','clearForm','applyJson','exportBtn','importBtn','resetBtn','btnExport','btnImport','btnReset'];
  ids.forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.disabled = !enable;
  });
}

function clearAdminForm(){
  EDIT_ID = null;
  document.getElementById('editorTitle') && (document.getElementById('editorTitle').textContent = 'Add Vehicle');
  ['make','model','year','price','type','image','transmission','fuel','seats'].forEach(id=>{ const el = document.getElementById(id); if(el) el.value = '';});
  document.getElementById('jsonArea') && (document.getElementById('jsonArea').value = '');
}

function adminSave(){
  if(!ADMIN_UNLOCKED){ alert('Unlock admin first'); return; }
  const make = document.getElementById('make').value.trim();
  const model = document.getElementById('model').value.trim();
  const year = parseInt(document.getElementById('year').value,10) || 0;
  const price = parseInt(document.getElementById('price').value,10) || 0;
  const type = document.getElementById('type').value.trim();
  const image = document.getElementById('image').value.trim() || 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1000&q=80';
  const transmission = document.getElementById('transmission').value.trim();
  const fuel = document.getElementById('fuel').value.trim();
  const seats = parseInt(document.getElementById('seats').value,10) || 5;

  if(!make||!model||!year||!price){ alert('Please fill required fields'); return; }
  let list = loadVehicles();
  if(EDIT_ID){
    const idx = list.findIndex(x=>x.id===EDIT_ID);
    if(idx>-1){
      list[idx] = { ...list[idx], make,model,year,price,type,image,features:{transmission,fuel,seats}};
    }
  } else {
    const newId = list.length ? Math.max(...list.map(x=>x.id))+1 : 1;
    list.push({ id:newId, make,model,year,price,type,image,features:{transmission,fuel,seats}});
  }
  saveVehicles(list);
  renderAdminList();
  clearAdminForm();
  alert('Saved — inventory updated (localStorage).');
}

function adminEdit(id){
  if(!ADMIN_UNLOCKED){ alert('Unlock admin first'); return; }
  const list = loadVehicles();
  const v = list.find(x=>x.id===id);
  if(!v) return;
  EDIT_ID = id;
  document.getElementById('editorTitle') && (document.getElementById('editorTitle').textContent = 'Edit Vehicle (ID ' + id + ')');
  document.getElementById('make').value = v.make;
  document.getElementById('model').value = v.model;
  document.getElementById('year').value = v.year;
  document.getElementById('price').value = v.price;
  document.getElementById('type')...
