(function ccLoad(win) {
  cc = {
    find: (sl) => {
      return document.querySelector(sl);
    },
    addState: (el, v) => {
      cc.manageAttrVal(el, 'data-s', v, 1);
    },
    removeState: (el, v) => {
      cc.manageAttrVal(el, 'data-s', v, 0);
    },
    toggleState: (el, v) => {
      cc.manageAttrVal(el, 'data-s', v);
    },
    manageAttrVal: (el, a, v, f) => {
      const oStr = el.getAttribute(a) || '',
            match = oStr.indexOf(v) > -1,
            rVal = typeof f !== 'undefined' ? !f : match,
            valid = (match && rVal) || (!match && !rVal);
      if (valid) {
        let uStr;
        if (rVal) {
          uStr = oStr.replace(v, '').replace(/\s{2,}/g, ' ').trim();
          !uStr && el.removeAttribute(a);
        } else {
          !match && (uStr = oStr + (oStr && ' ') + v);
        }
        uStr ? el.setAttribute(a, uStr) : '';
      }
    },
    initStorage: () => {
      if (win.localStorage) {
        try {
          cc.storageAlpha = localStorage.getItem('cc.alpha');
          cc.storageNotes = localStorage.getItem('cc.notes');
          cc.storageValue = localStorage.getItem('cc.value');
          cc.storage = true;
        } catch(e) {
        }
      }
    },
    initOutshotArray: () => {
      cc.oa = [
        0,
        0,
        ['D1, "the madhouse"'],
        ['1-D1'],
        ['D2'],
        ['1-D2'],
        ['D3, "the basement"'],
        ['3-D2'],
        ['D4'],
        ['1-D4'],
        //
        ['D5'],
        ['3-D4'],
        ['D6'],
        ['5-D4'],
        ['D7'],
        ['7-D4'],
        ['D8'],
        ['9-D4', '1-D8, don\'t bust on 20 or 18'],
        ['D9'],
        ['11-D4', '3-D8, don\'t bust on 19'],
        // 
        ['D10'],
        ['17-D2, same neighborhood, miss into 3 leaves D9', '5-D8, don\'t bust on 20'],
        ['D11, "swans on the lake"'],
        ['7-D8, or 19 leaves D2'],
        ['D12'],
        ['17-D4, miss into 3 leaves D11', '9-D8'],
        ['D13', '6-D10, or 10-D8'],
        ['19-D4, miss into 7 leaves D10, miss into 3 leaves D12', '11-D8, same neighborhood'],
        ['D14'],
        ['13-D8', '5-D12, same neighborhood'],
        // 
        ['D15'],
        ['15-D8'],
        ['D16'],
        ['17-D8, miss into 3 leaves D15', '1-D16'],
        ['D17'],
        ['3-D16, miss into 19 leaves D8, miss into 17 leaves D9'],
        ['D18'],
        ['5-D16'],
        ['D19'],
        ['7-D16, same neighborhood, miss into 19 leaves D10', '19-D10, miss into 7 leaves D16, miss into 3 leaves D18, don\'t bust on triple 19'],
        // 
        ['D20, "top of the shop"'],
        ['9-D16', '1-D20, same neighborhood'],
        ['10-D16, or 6 leaves D18'],
        ['3-D20, miss into 19 leaves D12, miss into 17 leaves D13', '11-D16'],
        ['4-D20, or triple 4 leaves D16, miss into 18 leaves D13', '12-D16'],
        ['5-D20, same neighborhood', '13-D16'],
        ['6-D20, or 10 leaves D18'],
        ['7-D20, miss into 19 leaves D14', '15-D16'],
        ['16-D16, or 8 leaves D20, don\'t bust on triple 16'],
        ['17-D16, don\'t bust on triple 17, miss into 3 leaves 46', '9-D20'],
        // 
        ['10-D20, T10 leaves D10', '18-D16, don\'t bust on triple 18', 'D25, use only as a last-dart option'], // "double bull"
        ['19-D16, don\'t bust on triple 19', '11-D20'],
        ['12-D20, or T12-D8', '20-D16, don\'t bust on triple 20'],
        ['13-D20', '${r}17-D18, miss into 3 leaves D25'],
        ['18-D18, same neighborhood, miss into 4 leaves 18-D16', '14-D20'],
        ['15-D20'],
        ['16-D20, or T16-D4'],
        ['17-D20'],
        ['18-D20'],
        ['19-D20'],
        // 
        ['20-D20'],
        ['T15-D8, 15 leaves 6-D20 or 10-D18', '${r}T11-D14, 11 leaves D25'],
        ['T10-D16, 10 leaves 12-D20, miss into 15 leaves 15-D16', '${r}T12-D13, 12 leaves D25'],
        ['T17-D6, 17 leaves 6-D20 or 10-D18, don\'t miss into 2', '${r}T13-D12, 13 leaves D25'],
        ['T16-D8, 16 leaves 48, neighboring 8 beds are safe', '${r}T14-D11, 14 leaves D25'],
        ['T11-D16, 11 or neighbor leaves < 60', 'T19-D4, 19 leaves 6-D20 or 10-D18', '${r}T15-D10, 15 leaves D25'],
        ['T10-D18, triple 10 has decent neighbors', '${r}T16-D9, 16 leaves D25'], // T18-D6, 18 leaves 48, don\'t miss into 1 or 4
        ['T9-D20, 9 leaves 18-D20, miss into neighbor also leaves < 60', '${r}T17-D8, 17 leaves D25'],
        ['T16-D10, any 8 or 16 leaves <= 60', '${r}T18-D7, 18 leaves D25, double 18 leaves D16'], // T12-D16, 12 leaves 16-D20
        ['T15-D12, 15 leaves 14-D20', '${r}T19-D6, 19 leaves D25'],
        // 
        ['T10-D20, 10 leaves 20-D20, miss into 15 leaves 15-D20', '${r}T20-D5, 20 leaves D25'],
        ['T13-D16, 13 leaves 18-D20', '${r}T19-D7, miss into triple 7 leaves D25'],
        ['T16-D12, 16 leaves 16-D20', 'T20-D6, 20 leaves 20-D16 or 12-D20'],
        ['T19-D8, 19 leaves 14-D20'],
        ['T14-D16, 14 leaves 20-D20', '${r}T16-D13, miss into triple 8 leaves D25, miss into neighbor leaves < 70'],
        ['T17-D12, 17 leaves 18-D20'],
        ['T16-D14, 16 or neighbor leaves < 70', 'T20-D8, don\'t miss into 1 or 5, 20 leaves 16-D20'],
        ['T19-D10, 19 leaves 18-D20'],
        ['T18-D12, 18 leaves 20-D20'],
        ['T13-D20, 13 leaves T16-D9 or 16-D25', 'T19-D11, 19 leaves 20-D20'],
        // 
        ['T20-D10, 20 leaves 20-D20, miss into double 20 leaves D20', 'T16-D16'],
        ['T19-D12, 19 leaves T12-D13 or 12-D25', 'T15-D18, 15 leaves T16-D9 or 16-D25', 'bull route, 25-16-D20, D25-15-D8, no triple required'],
        ['T14-D20, 14 leaves T18-D7 or 18-D25', 'bull route, D25-D16, 25-17-D20, no triple required'],
        ['T17-D16, 17 leaves T16-D9 or 16-D25', 'bull route, 25-18-D20, D25-17-D8, no triple required'],
        ['T20-D12, 20 leaves T14-D11 or 14-D25', 'bull route, 25-19-D20, D25-D17, no triple required'],
        ['T15-D20, 15 leaves T20-D5 or 20-D25', 'T19-D14, 19 leaves T16-D9 or 16-D25, miss into triple 7 leaves 64', 'bull route, D25-3-D16 / 25-20-D20, no triple required'],
        ['T18-D16, 18 leaves T18-D7 or 18-D25'],
        ['T17-D18, 17 leaves T20-D5 or 20-D25'],
        ['T20-D14, 20 leaves T18-D7 or 18-D25', 'T16-D20, 16 leaves > 70'],
        ['T19-D16, 19 leaves T20-D5 or 20-D25'],
        // 
        ['T20-D15, 20 leaves T20-D5 or 20-D25', 'bull route, D25-D20, 25 leaves T15-D10 or 15-D25', '${r}T18-D18'],
        ['T17-D20', 'bull route, D25-9-D16, 25 leaves T16-D9 or 16-D25'],
        ['T20-D16', 'bull route, D25-10-D16, 25 leaves T17-D8 or 17-D25'],
        ['T19-D18', 'bull route, D25-3-D20, 25 leaves T18-D7 or 18-D25'],
        ['T18-D20', 'bull route, D25-4-D20, 25 leaves T19-D6 or 19-D25'],
        ['bull route, D25-5-D20, 25 leaves T20-D5 or 20-D25', '${r}T19-D19'],
        ['T20-D18'],
        ['T19-D20'],
        ['T20-D19', 'T16-D25, 16 leaves T14-D20'],
        ['T19-10-D16, 19 leaves T20-D10 or D20-D20', 'T17-16-D16, T17 leaves 48..., ...but 17 leaves > 80'],
        // 
        ['T20-D20, don\'t die on single 1, 20 leaves T20-D10 or D20-D20'],
        ['T20-9-D16', 'T19-12-D16, or T19-T12-D4', '${s}T17-D25, don\'t die on single 2'],
        ['T20-10-D16, or T20-6-D18', 'T18-16-D16, or T18-8-D20'],
        ['T19-6-D20, or T19-10-D18', 'T17-12-D20'],
        ['T19-15-D16, miss into 7 or 3 won\'t kill you', '${s}T18-D25'],
        ['T20-13-D16, miss into 1 or 5 won\'t kill you', 'T19-16-D16, don\'t die on single 3'],
        ['T20-6-D20, or T20-10-D18'],
        ['T19-10-D20, or T19-T10-D10', '${s}T19-D25'],
        ['T20-16-D16', 'T19-19-D16, or T19-11-D20'],
        ['T20-9-D20', 'T19-T12-D8'],
        // 
        ['T20-T10-D10, T20-10 leaves D20', '${s}T20-D25'],
        ['T19-14-D20, miss into 7 or triple 7 is safe', 'T20-11-D20, miss into 1 leaves T20-D25'],
        ['T20-12-D20, or T20-T12 leaves D8'],
        ['T19-16-D20, miss into 3 or triple 3 is safe'],
        ['T19-17-D20, miss into 7 or triple 7 is safe', 'T20-14-D20'],
        ['T20-15-D20, miss into 5 or triple 5 is safe', 'T19-18-D20'],
        ['T19-19-D20, miss into triple 7 or triple 3 is safe', 'T20-16-D20'],
        ['T20-17-D20, 20 leaves T19-D20'],
        ['T20-18-D20, 20 leaves T20-D19 or T16-D25', 'T18-T14-D11, 18 leaves T20-D20, T18-14 leaves D25'],
        ['T19-T12-D13, 19 leaves T20-D20, T19-12 leaves D25'],
        // 
        ['T20-20-D20, "Shanghai"'],
        ['T20-T11-D14, 20 leaves T17-D25', 'T17-T20-D5, 17 leaves T18-D25'],
        ['T18-T18-D7, 18 leaves T18-D25'],
        ['T19-T16-D9, 19 leaves T18-D25, T19-16 leaves D25'],
        ['T20-T14-D11, 20 leaves T18-D25, T20-14 leaves D25', 'T20-T8-D20, or T20-T16-D8'],
        ['bull route, 25-T20-D20, D25 leaves 25-D25 or T17-D12', 'T19-T18-D7, T19-18 leaves D25', 'T20-T19-D4, T20-19 leaves 46'],
        ['T19-T19-D6, 19 leaves T19-D25, T19-19 leaves D25'],
        ['T20-T17-D8, 20 leaves T19-D25, T20-17 leaves D25'],
        ['T18-T14-D16, 18 leaves T20-D25..., ...but triple 18 leaves > 70', 'T20-T18-D7, triple 20 leaves < 70..., ...but 20 leaves no out'],
        ['T19-T16-D12, 19 leaves T20-D25..., ...but triple T19 leaves > 70', 'T20-T19-D6, triple 20 leaves < 70..., ...but 20 leaves no out'],
        // 
        ['T20-T20-D5, 20 leaves T20-D25', 'T20-T10-D20, 20 leaves T20-D25'],
        ['T19-T14-D16, miss into triple 7 leaves T20-D25'],
        ['bull route, D25-T14-D20, D25-D25-D16, 25-T19-D25', 'T20-T16-D12'],
        ['T20-T19-D8'],
        ['T20-T16-D13'],
        ['bull route, D25-T15-D20, 25-T20-D25', 'T20-T17-D12'],
        ['T20-T20-D8'],
        ['T20-T19-D10', 'T19-T16-D16'],
        ['T20-T18-D12, "the Deller checkout"', 'T19-T19-D12'],
        ['T20-T13-D20', 'T20-T19-D11, T20-19 leaves 60'],
        // 
        ['T20-T20-D10', 'T20-T16-D16'],
        ['T20-T19-D12 '],
        ['T20-T14-D20', 'T19-T19-D14'],
        ['T20-T17-D16', 'T19-T18-D16'],
        ['T20-T20-D12', 'T18-T18-D18'],
        ['T20-T19-D14', 'T20-T15-D20'],
        ['T20-T18-D16', 'T19-T19-D16'],
        ['T20-T17-D18', 'T19-T18-D18'],
        ['T20-T20-D14', 'T19-T17-D20', 'T20-T16-D20'],
        ['T20-T19-D16'],
        // 
        ['T20-T18-D18', 'T19-T19-D18'],
        ['T20-T17-D20', 'T19-T18-D20'],
        ['T20-T20-D16'],
        ['T20-T19-D18'],
        ['T20-T18-D20'],
        ['T20-T19-D19, the only way'],
        ['T20-T20-D18, the only way'],
        ['T19-T20-D20'],
        ['T20-T20-D19', 'T19-T17-D25', 'T18-T18-D25'],
        ['n/a, there is no outshot for 159'],
        // 
        ['T20-T20-D20'],
        ['T20-T17-D25'],
        ['n/a, there is no outshot for 162'],
        ['n/a, there is no outshot for 163'],
        ['T20-T18-D25', 'T19-T19-D25'],
        ['n/a, there is no outshot for 165'],
        ['n/a, there is no outshot for 166'],
        ['T20-T19-D25'],
        ['n/a, there is no outshot for 168'],
        ['n/a, there is no outshot for 169'],
        // 
        ['T20-T20-D25']
      ];
    },
    initToggleButtons: () => {
      cc.storageAlpha !== '0' ? cc.addState(wrap, 'alpha') : '';
      cc.storageNotes !== '0' ? cc.addState(wrap, 'notes') : '';
      cc.find('[data-r~=alphaBtn]').addEventListener('click', () => {
        cc.clickAlphaBtn();
        cc.generateOutput();
      });
      cc.find('[data-r~=notesBtn]').addEventListener('click', () => {
        cc.clickNotesBtn();
      });
    },
    initIncrementalButtons: () => {
      leftBtn.addEventListener('click', () => {
        leftBtn.matches('[data-s~=enabled]') ? cc.clickIncrementalBtn('l') : '';
      });
      rightBtn.addEventListener('click', () => {
        rightBtn.matches('[data-s~=enabled]') ? cc.clickIncrementalBtn('r') : '';
      });
    },
    initSlider: () => {
      slider.addEventListener('input', (e) => {
        cc.generateOutput(e);
      });
    },
    initField: () => {
      field.addEventListener('input', (e) => {
        cc.generateOutput(e);
      });
      if (cc.storageValue) {
        field.value = cc.storageValue;
        cc.generateOutput();
      } else {
        cc.populateRandomNumber();
      }
    },
    initRandomButton: () => {
      cc.find('[data-r~=randomBtn]').addEventListener('click', () => {
        wrap.matches('[data-s~=mapMode]') ? cc.removeState(wrap, 'mapMode') : cc.populateRandomNumber();
      });
    },
    initMapLink: () => {
      cc.find('[data-r~=mapLink]').addEventListener('click', () => {
        cc.clickMapLink();
      });
      cc.mapScript = cc.find('[data-r~=mapScript]');
    },
    initMap: () => {
      if (!cc.mapScript.hasAttribute('src')) {
        return cc.mapScript.setAttribute('src', 'http://maps.google.com/maps/api/js?key=AIzaSyDVnlUOgIc-cqAi3hgYXtUlTjV2Q0pnl3Q&callback=cc.initMap');
      }
      const mapContainer = cc.find('[data-r~=mapContainer]'),
            mapList = cc.find('[data-r~=mapList]'),
            mapOptions = {
              mapTypeId: google.maps.MapTypeId.ROADMAP, 
              mapTypeControl: false,
              zoom: 11
            },
            mapObject = new google.maps.Map(mapContainer, mapOptions),
            markerInfo = new google.maps.InfoWindow(),
            mapData = {
              "list": mapList,
              "locations": [  
                { "lng":-87.703580, "lat":41.691787, "valid":"1", "abbr":"Blackthorn", "name":"Blackthorn Pub", "address":"3300 W 111th St", "city":"Chicago", "state":"IL", "zip":"60655" },
                { "lng":-87.681983, "lat":41.704949, "valid":"1", "abbr":"Brewbakers", "name":"Brewbakers", "address":"10350 S Western Ave", "city":"Chicago", "state":"IL", "zip":"60643" },
                { "lng":-87.807066, "lat":41.865059, "valid":"1", "abbr":"Carole's", "name":"Carole's", "address":"7307 Roosevelt Rd", "city":"Forest Park", "state":"IL", "zip":"60130" },
                { "lng":-87.777780, "lat":41.710847, "valid":"1", "abbr":"Cullen's", "name":"Cullen's Pub", "address":"9953 SW Hwy", "city":"Oak Lawn", "state":"IL", "zip":"60453" },
                { "lng":-87.681758, "lat":41.699787, "valid":"1", "abbr":"Dingers", "name":"Dingers Sports Bar", "address":"10638 S Western Ave", "city":"Chicago", "state":"IL", "zip":"60643" },
                { "lng":-87.679738, "lat":41.656811, "valid":"1", "abbr":"Double Play", "name":"Double Play Saloon", "address":"13011 S Western Ave", "city":"Blue Island", "state":"IL", "zip":"60406" },
                { "lng":-87.681176, "lat":41.654376, "valid":"0", "abbr":"Eagles", "name":"Fraternal Order of Eagles", "address":"2427 Grove St", "city":"Blue Island", "state":"IL", "zip":"60406" },
                { "lng":-87.696591, "lat":41.691448, "valid":"1", "abbr":"Hippo's", "name":"Hippo's", "address":"3011 W 111th St", "city":"Chicago", "state":"IL", "zip":"60655" },
                { "lng":-87.768152, "lat":41.690734, "valid":"1", "abbr":"JP's Shortstop", "name":"JP Shortstop's", "address":"5944 W 111th St", "city":"Chicago Ridge", "state":"IL", "zip":"60415" },
                { "lng":-87.737050, "lat":41.641756, "valid":"1", "abbr":"Longford", "name":"Longford Pub", "address":"13813 S Cicero Ave", "city":"Crestwood", "state":"IL", "zip":"60445" },
                { "lng":-87.681717, "lat":41.649333, "valid":"1", "abbr":"Natural Law", "name":"Natural Law", "address":"13404 Old Western Ave", "city":"Blue Island", "state":"IL", "zip":"60406" },
                { "lng":-87.681441, "lat":41.692083, "valid":"1", "abbr":"O'Rourkes", "name":"O'Rourkes Office", "address":"11064 S Western Ave", "city":"Chicago", "state":"IL", "zip":"60643" },
                { "lng":-87.787049, "lat":41.582086, "valid":"1", "abbr":"Old Tinley", "name":"Old Tinley Pub &amp; Eatery", "address":"17010 Oak Park Ave", "city":"Tinley Park", "state":"IL", "zip":"60477" },
                { "lng":-87.668344, "lat":41.650613, "valid":"1", "abbr":"Riverside", "name":"Riverside Tap Room", "address":"13351 Aulwurm Dr", "city":"Blue Island", "state":"IL", "zip":"60406" },
                { "lng":-87.797646, "lat":41.711434, "valid":"1", "abbr":"Rosa's", "name":"Rosa's Pizza & Italian Restaurant", "address":"9909 Harlem Ave", "city":"Chicago Ridge", "state":"IL", "zip":"60415" }
                // { "lng":-87.799096, "lat":41.676364, "valid":"1", "abbr":"Mister Mo's", "name":"Mister Mo's", "address":"7214 W College Dr", "city":"Palos Heights", "state":"IL", "zip":"60463" },
                // { "lng":-87.680132, "lat":41.667301, "valid":"1", "abbr":"Northside Inn", "name":"Chris's Northside Inn", "address":"12431 Western Ave # 2", "city":"Blue Island", "state":"IL", "zip":"60406" },
                // { "lng":-87.739758, "lat":41.676695, "valid":"1", "abbr":"Southsides", "name":"Southsides", "address":"11860 S Cicero Ave", "city":"Alsip", "state":"IL", "zip":"60803" },
                // { "lng":-87.793816, "lat":41.699888, "valid":"1", "abbr":"Racks", "name":"Racks Tap", "address":"10533 SW Hwy", "city":"Worth", "state":"IL", "zip":"60482" },
                // { "lng":-87.818445, "lat":41.726085, "valid":"0", "abbr":"Roadhouse", "name":"Roberts Roadhouse", "address":"9090 S Roberts Rd", "city":"Hickory Hills", "state":"IL", "zip":"60457" },
                // { "lng":-87.737763, "lat":41.626680, "valid":"1", "abbr":"Slapshots", "name":"Slapshots Sports Bar and Grill", "address":"14608 S Cicero Ave", "city":"Midlothian", "state":"IL", "zip":"60445" },
                // { "lng":-87.793763, "lat":41.719763, "valid":"1", "abbr":"West End", "name":"West End Tavern", "address":"6950 W 95th St", "city":"Oak Lawn", "state":"IL", "zip":"60453" }
              ]
            },
            markerArray = [];
      mapObject.setCenter({ lat: 41.66285503596006, lng: -87.72024167178341 });
      mapData.locations.forEach((loc, i) => {
        // create marker
        const marker = new google.maps.Marker({
          map: mapObject,
          position: { lat:loc.lat, lng:loc.lng }
        });
        markerArray.push(marker);
        google.maps.event.addListener(marker, 'click', ((marker, i) => {
          return () => {
            let info  = '<b>' + loc.name + '</b><br />';
            info += loc.address + '<br />';
            info += loc.city + ', ' + loc.state + '<br />';
            info += '<a rel="noopener noreferrer" href="http://maps.apple.com/?saddr=current+location&daddr='+ encodeURIComponent(loc.valid=='1' ? loc.name : '' + ', ' + loc.address + ', ' + loc.city + ', ' + loc.state) +'">DIRECTIONS</a>';
            markerInfo.setContent(info);
            markerInfo.open(mapObject, marker);
          }
        })(marker, i));
        // create list item
        const li = document.createElement('li');
        li.setAttribute('class', 'cc_mli');
        li.appendChild(document.createTextNode(loc.abbr));
        li.addEventListener('click', (e) => { 
          google.maps.event.trigger(markerArray[i], 'click');
          mapObject.setZoom(14);
          mapObject.panTo(markerArray[i].position);
        });
        mapData.list.appendChild(li);
      });
      cc.addState(wrap, 'mapRendered');
    },
    clickMapLink: () => {
      if (!wrap.matches('[data-s~=mapRendered]')) {
        cc.initMap();
      }
      cc.toggleState(wrap, 'mapMode');
    },
    clickAlphaBtn: () => {
      cc.toggleState(wrap, 'alpha');
      cc.storage && localStorage.setItem('cc.alpha', wrap.matches('[data-s~=alpha]') ? 1 : 0);
    },
    clickNotesBtn: () => {
      cc.toggleState(wrap, 'notes');
      cc.storage && localStorage.setItem('cc.notes', wrap.matches('[data-s~=notes]') ? 1 : 0);
    },
    clickIncrementalBtn: (d) => {
      let val = parseInt(field.value);
      field.value = d === 'r' ? ++val : --val;
      cc.generateOutput();
    },
    manageIncrementalBtnStates: (v) => {
      cc.manageAttrVal(leftBtn, 'data-s', 'enabled', !!(v && v > 2));
      cc.manageAttrVal(rightBtn, 'data-s', 'enabled', !!(v && v < 170));
    },
    populateRandomNumber: () => {
      const v = Math.floor(Math.random() * 169 + 2),
            exclusions = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 159, 162, 163, 165, 166, 168, 169];
      if (exclusions.includes(v)) {
        cc.populateRandomNumber();
      } else {
        field.value = v;
        cc.generateOutput();
      }
    },
    convertAlphanumericString: (s) => {
      let d, t;
      s.trim().split(/[\s-]+/).forEach(() => {
        if (d = s.match(/D[^a-z][0-9]*/)) {
          s = s.replace(/D[0-9]*/, parseInt(d[0].substr(1) * 2));
        }
        if (t = s.match(/T[^a-z][0-9]*/)) {
          s = s.replace(/T[0-9]*/, parseInt(t[0].substr(1) * 3));
        }
      });
      return s;
    },
    generateOutput: (e) => {
      const v = parseInt(e ? e.target.value : field.value),
            o = cc.oa[v];
      if (o) {
        let html = '',
            footnote;
        o.forEach((lines) => {
          lines = lines.split(',');
          html += '<span class="cc_o">';
          for (let i = 0; i < lines.length; i++) {
            let clss = i === 0 ? 'cc_op' : 'cc_os',
                line = lines[i];
            if (i === 0 && line.indexOf('$') === 0) {
              clss += ' cc_opp';
              footnote = line.substr(2, 1);
              line = line.substr(4);
            }
            if (!wrap.matches('[data-s~=alpha]')) {
              line = cc.convertAlphanumericString(line);
            }
            if (i === 0) {
              line = line.replace(/-/gi,' &ndash; ');
              if (line === 'bull route') {
                clss += ' cc_obr';
              }
            }
            html += '<span class="' + clss + '">' + line.trim() + '</span>';
          }
          html += '</span>';
        });
        if (footnote) {
          html += '<span class="cc_f cc_f' + footnote + '"></span>';
        }
        cc.addState(wrap, 'results');
        field.value = slider.value = v;
        if (cc.storage) {
          localStorage.setItem('cc.value', v);
        }
        results.innerHTML = html;
      }
      else {
        cc.removeState(wrap, 'results');
        results.innerHTML = '';
      }
      cc.manageIncrementalBtnStates(o && v);
    }
  };
  const wrap = cc.find('[data-r~=wrap]'),
        field = cc.find('[data-r~=field]'),
        results = cc.find('[data-r~=results]'),
        leftBtn = cc.find('[data-r~=leftBtn]'),
        rightBtn = cc.find('[data-r~=rightBtn]'),
        slider = cc.find('[data-r~=slider]');
  cc.initStorage();
  cc.initOutshotArray();
  cc.initToggleButtons();
  cc.initIncrementalButtons();
  cc.initSlider();
  cc.initField();
  cc.initRandomButton();
  cc.initMapLink();
})(window);
