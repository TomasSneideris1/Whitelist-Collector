(async function () {
  const formEl = document.querySelector("form");
  const tableEl = document.querySelector("table");
  const tbodyEl = tableEl.querySelector("tbody");

  const getWhitelist = async () => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get({whitelists: JSON.stringify([])}, function (result) {
        if (result === undefined) {
          reject();
        } else {
          resolve(JSON.parse(result.whitelists))
        }
      });
    });
  };

  const setWhitelist = async (whitelists) => {
    chrome.storage.sync.set(
      { whitelists: JSON.stringify(whitelists) },
      function (result) {
        console.log("whitelists is set  " + result);
      }
    );
  };

  const onDeleteRow = async (btn, index) => {
    // Get all the current WL's.
    const whitelists = await getWhitelist();

    // remove specific whitelist from the list.
    whitelists.splice(index, 1);

    await setWhitelist(whitelists);

    // re-create the table.
    formTable(whitelists);
  };

  const formTable = async () => {
    // Get all the current WL's.
    const whitelists = await getWhitelist();

    // remove table before we recreate it.
    tbodyEl.innerHTML = '';

    if (whitelists.length === 0) {
      return;
    }

    whitelists.forEach((whitelist, index) => {
      const tr = tbodyEl.insertRow();

      // Add text to the table.
      Object.keys(whitelist).forEach((key) => {
        const td = tr.insertCell();
        const value = document.createTextNode(whitelist[key]);
        td.appendChild(value);
      });

      // Add delete button.
      const td = tr.insertCell();
      const btn = document.createElement("button");
      btn.innerHTML = "Delete";
      btn.className = "deleteBtn";
      td.appendChild(btn);

      // Add event listener to the button.
      btn.addEventListener("click", function () {
        onDeleteRow(this, index);
      });
    });
  };

  const onAddProject = async (e) => {
    // Get all the current WL's.
    const whitelists = await getWhitelist();
    e.preventDefault();

    const link = document.getElementById("link").value;
    const date = document.getElementById("date").value;
    const price = document.getElementById("price").value;
    const wl = document.getElementById("wl").value;
    const name = document.getElementById("name").value;

    // Add the new wl to the list.
    whitelists.push({
      name,
      wl,
      price,
      date,
      link,
    });

    // update the whitelists.
    await setWhitelist(whitelists);

    // re-create the table.
    formTable(whitelists);
  };

  formTable();

  formEl.addEventListener("submit", onAddProject);
})();