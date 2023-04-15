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
    });
    servers.forEach(function (server) {
        var latLng = new google.maps.LatLng(server.lamb.long, server.lamb.lat);
        var marker = new google.maps.Marker({
            position: latLng,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                strokeColor: "red",
                scale: 3
            },
            title: Math.round(server.time.tfb).toString() + 'ms',
            map: map
        });
        var latLng2 = new google.maps.LatLng( server.serv.lat,server.serv.long);
        var marker2 = new google.maps.Marker({
            position: latLng2,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                strokeColor: "yellow",
                scale: 3
            },
            title: server.serverIp ,
            map: map
        });
        var html = '<style>h2, p {margin: 0; }</style><p>IP: '+ server.myip +'</p><p >Wait: '+ Math.round(server.time.wait)  +'ms</p><p>DNS: '+ Math.round(server.time.dns)  +'ms</p><p>TCP: '+ Math.round(server.time.tcp)  +'ms</p><p>TTFB: '+ Math.round(server.time.tfb)  +'ms</p><p>Download: '+ Math.round(server.time.download) +'ms</p><p>Total: '+ Math.round(server.time.total) +'ms</p><p>org: '+server.org  +'</p>';
        
        var infowindow = new google.maps.InfoWindow({

          //  content: JSON.stringify(server.time)
            content: html
             });
            marker.addListener('click', function () {
            infowindow.open(map, marker);
        });
       
        // console.log ('lambda: ', server.lamb);
//         console.log('lllllll: ');

        const Circle = new google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.2,
            strokeWeight: 1,
            fillColor: "#FF0000",
            fillOpacity: 0.05,
            map,
            center: {
                lat: server.lamb.long, 
                lng: server.lamb.lat},
            radius: server.time.tfb * 10000,
        });
        
        var line = new google.maps.Polyline({
            path: [{
                lat: server.lamb.long,
                lng: server.lamb.lat
            }, {
                lat: server.serv.lat,
                lng: server.serv.long
            }],
            strokeOpacity: 1,
            strokeColor: server.strokeColor,
            strokeWeight: 2,
            map: map
        });

        // var heatMapData = [
        //     {location: new google.maps.LatLng(server.lamb.long, server.lamb.lat), weight: 100},
        //     {location: new google.maps.LatLng(server.lamb.long+1, server.lamb.lat), weight: 100}
        //   ];
        //   var heatmap = new google.maps.visualization.HeatmapLayer({
        //     data: heatMapData
        //   });
        //   heatmap.setMap(map);

    })
}
