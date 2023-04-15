function ValidURL(str) {
    const regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex.test(str)) {
      alert(`Please enter a valid URL. For example: https://www.google.com`);
      return false;
    } else {
      return true;
    }
  }
  
  const send_msg = () => {
    const msg = document.getElementById("form_message").value;
  
    $.ajax({
      type: "POST",
      url: "https://90x6smwna9.execute-api.us-east-1.amazonaws.com/prod/send_message",
      data: `Serverlatency ${msg}`,
      crossDomain: true,
      datatype: "text",
      headers: {
        "Access-Control-Allow-Origin": "http://www.serverlatency.com",
      },
      success: (data) => {
        console.log(data.Message);
        document.getElementById("response").innerText = data.Message;
      },
    });
  };
  
  function addHttp(domain) {
    if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
        domain = 'https://' + domain;
    }
    return domain;
}

  const render_map = () => {
    var domain = document.getElementById("domain").value;
    domain = addHttp(domain);
    if (!ValidURL(domain)) {
      throw new Error();
    } else {
      if (domain.includes("https")) {
        domain = domain.replace("https://", "1");
      }
      if (domain.includes("http")) {
        domain = domain.replace("http://", "0");
      }
  
      domain = domain.replace(/\//g, "__");
      console.log(domain);
  
      $.ajax({
        type: "GET",
        url: `https://90x6smwna9.execute-api.us-east-1.amazonaws.com/prod/${domain}`,
        crossDomain: true,
        datatype: "json",
        headers: {
          "Access-Control-Allow-Origin": "http://www.serverlatency.com",
        },
        success: (data) => {
          console.log(data);
          load_map(data);
          console.log(`data.rg ${data[0].org}`);
  
          const blokk = document.getElementById("blokk");
          blokk.style.display = "block";
  
          const server = document.getElementById("server");
          server.textContent = data[0].org;
        },
      });
    }
  };
  
  const load_map = (servers) => {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: {
        lat: servers[0].lamb.long,
        lng: servers[0].lamb.lat + 25,
      },
      zoom: 2,
   