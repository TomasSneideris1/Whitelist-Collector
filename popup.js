const formEl = document.querySelector("form");
const tbodyEl = document.querySelector("tbody");
const tableEl = document.querySelector("table");

            
        function onAddProject(e) {
            e.preventDefault();

            const link = document.getElementById('link').value;
            chrome.storage.sync.set({'link': link}, function() {
                console.log('link set ' + link);
            });

            const date = document.getElementById('date').value;
            chrome.storage.sync.set({'date': date}, function() {
                console.log('date set ' + date);
            });

            const price = document.getElementById('price').value;
            chrome.storage.sync.set({'price': price}, function() {
                console.log('price set ' + price);
            });

            const wl = document.getElementById('wl').value;
            chrome.storage.sync.set({'wl': wl}, function() {
                console.log('Whitelisteds set ' + wl);
            });

            const name = document.getElementById('name').value;
            chrome.storage.sync.set({'nameChange': name}, function() {
            		console.log('name is set  ' + name);
            });
            
            tbodyEl.innerHTML += `
            <tr>
               <td>${name}</td>
                <td>${wl}</td>
                <td>${price}</td>
                <td>${date}</td>
                <td>${link}</td>
                <td><button class="deleteBtn">Delete</button></td>
            </tr>
            `
        }
      
    const onDeleteRow = async (e) =>  {
      const info = await getValue();
      console.log("ateina i removeCell funkcija" + info);
      chrome.storage.local.remove(info,function(){
        console.log("cia po remove funkcijos is storage" + info);
        var error = chrome.runtime.lastError;
           if (error) {
               console.error(error);
           }
           console.log("Cia info delete funkcijoj "+ info);
       })
       

    	if (!e.target.classList.contains("deleteBtn")) {
        return;
    	}

    const btn = e.target;
    btn.closest("tr").remove();

  }
  
    const readLocalStorage = async (key) => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get([key], function (result) {
        if (result[key] === undefined) {
          reject();
        } else {
          resolve(result[key]);
        } 
      });
    });
  };

  const formTable = async () => {
  const names = await readLocalStorage('nameChange');
  const wl = await readLocalStorage('wl');
  const price = await readLocalStorage('price');
  const date = await readLocalStorage('date');
  const link = await readLocalStorage('link');
      
    tbodyEl.innerHTML += `
    <tr>
       <td>${names}</td>
        <td>${wl}</td>
        <td>${price}</td>
        <td>${date}</td>
        <td>${link}</td>
        <td><button class="deleteBtn">Delete</button></td>
    </tr>
    `
    
  }
const getValue = async () => {
  const names = await readLocalStorage('nameChange');
  const wl = await readLocalStorage('wl');
  const price = await readLocalStorage('price');
  const date = await readLocalStorage('date');
  const link = await readLocalStorage('link');
  return names;
}


  formTable();

  formEl.addEventListener("submit", onAddProject);
  tableEl.addEventListener("click", onDeleteRow);
