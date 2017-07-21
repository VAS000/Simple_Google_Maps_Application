$(function(){

    // Global Variables
    var map;
    var currentAction;
    var points = new google.maps.MVCArray();
    var polygons = new Array();
    var fixedNums = 4;
    var firstDraw = true;
    var polygon;
    var markers = new Array();

    // Adjust Map Size To Fill Window height
    $('.gmap').height($(window).height() - '8');

    // Initialization Function 
    function init() {
        var props= {
            center: new google.maps.LatLng(-37.82, 144.95),
            zoom: 14,
            draggableCursor:'crosshair'
        };
        map=new google.maps.Map(document.getElementById("gmap"), props);
        google.maps.event.addListener(map, 'click', function(e){
            if(currentAction === 'marker'){
                addMarker(e.latLng);
                currentAction = false;
            }else if(currentAction === 'polygon'){
                if(firstDraw){
                    startDrawingPolygon(e.latLng);
                }else{
                    continueDrawingPolygon(e.latLng);
                }
            }
            $('.control-area .box button').removeClass('active').text('Apply');
        });
    }
    
    /* List Items */

    $('.control-list li').on('click', function(){
        $('.control-list li').removeClass('active');
        $(this).addClass('active');
        $('.control-area').hide();
        var section = $(this).data('section');
        $('.'+section).slideDown(350);
    });

    $('.control-area button.add').on('click', function(){
        currentAction = $(this).data('section');
        $(this).text('Active').addClass('active');
    });


    /* Marker Functions */
    
    function getObjectIndexById(id){
        for(var i=0; i<markers.length; i++){
            if(markers[i].ID === id){
                return i;
            }
        }
        return false;
    }
    function updateLocations(id, Coordinates){
        var index = getObjectIndexById(id);
        markers[index].lat = Coordinates.lat().toFixed(fixedNums);
        markers[index].lng = Coordinates.lng().toFixed(fixedNums);
        return (index === false)? false: true;
    }

    function updateMarker(m){
        for(var i=0; i<markers.length; i++){
            if(markers[i].ID == m){
                markers[i].setOptions({editable: true, draggable: true});
                return true;
            }
        }
    }
    function markerIdExists(id){
        for(var i=0; i<markers.length; i++){
            if(markers[i].ID == id){
                return true;
            }
        }
        return false;
    }

    function addMarker(Coordinates){
        var id = $('#marker_id').val();
        if(markerIdExists(id)){
            alert('Please Choose Unique ID');
            return;
        }else if(id.length === 0 || id.length > 10){
            alert('ID Must Between 1 Or 10 Characters');
            return;
        }
        var m_text = $('#marker_text').val();
        if(m_text.length > 2){
            alert('ID Must Be Maximum 2 Characters');
            return;
        }
        var info = $('#marker_info_text').val();
        var maxAllowed = 100;
        if(info.length > maxAllowed){
            alert('Max Characters Allowed: ' + maxAllowed);
            return;
        }
        var content = '';
        if(info.length > 0){
            content = '<div class="marker-content" style="color: ' + $('#marker_info_color').val() + '"><h4>';
            content += info + '</h4></div>';
            var infowindow = new google.maps.InfoWindow({
                content: content
            });
        }
        var marker = new google.maps.Marker({
            //{lat: -34.397, lng: 150.644},
            position: {lat: Coordinates.lat(), lng: Coordinates.lng()}, 
            map: map,
            draggable: false,
            animation: google.maps.Animation.DROP,
            ID: id,
            infoWindowText: content,
            editable: false
        });

        if(m_text.length > 0){
            marker.setOptions({
                label: {text: m_text, color: $('#marker_label_color').val() }
            }); 
        }

        // Add Listeners

        google.maps.event.addListener(marker, 'mouseover', function(e){
            if(this.infoWindowText.length > 0){
                infowindow.open(map, this);
            }
        });

        google.maps.event.addListener(marker, 'mouseout', function(e){ 
            if(this.infoWindowText.length > 0){
                infowindow.close();
            }
        });

        // Add Event DragEnd To Update Current Location Coordinates
        google.maps.event.addListener(marker, 'dragend',function(e) {
            if(updateLocations(marker.ID, e.latLng)){
                alert('Marker Updated Successfully');
                this.setOptions({editable: false, draggable: false});
            }else{
                alert('Error Updating Marker "' + this.id + '"');
            }
        });
        
        markers.push(marker);
        $('#marker_id').val('');
        $('#marker_text').val('');
        $('#marker_info_text').val('');
        $('#marker_label_color').val('#FFFFFF');
        $('#marker_info_color').val('#333333');
    }

    function removeMarker(id){
        var index = undefined;
        for(var i=0; i<markers.length; i++){
            if(markers[i].ID == id){
                index = i;
                break;
            }
        }
        if(index !== undefined){
            markers[index].setMap(null);
            markers.splice(index, 1);
            return true;
        }
        return false;
    }

    function getMarkers(s) {
        for(var i=0; i<markers.length; i++){
            var e = '<option value="'+markers[i].ID +'">' + markers[i].ID + '</option>';
            s.append(e);
        }
    }

    $('#marker_visibility, #marker_delete, #marker_edit').on('click', function(){
        var s = $('.'+$(this).attr('id')).find('select');
        s.empty();
        getMarkers(s);
    });
    
    $('.marker_visibility button').on('click', function(){
        var m = $('.marker_visibility select').val();
        if(!m){
            alert('No Marker To Select');
            return;
        }
        var v = $('.marker_visibility input[name=m_visibility]:checked').val();
        var b = v === 'false' ? false : true;
        if(markerIdExists(m)){
            for(var i=0; i<markers.length; i++){
                if(markers[i].ID == m){
                    markers[i].setVisible(b);
                    break;
                }
            }
        }else{
            alert('Label Not Found!');
        }
    });
    
    $('.marker_delete button').on('click', function(){
        var s = $('.marker_delete select');
        var m = s.val();
        if(!m){
            alert('No Marker To Select');
            return;
        }
        if($('.marker_delete input[name="m_confirm"]').is(':checked')){
            for(var i=0; i<markers.length; i++){
                if(markers[i].ID == m){
                    if(removeMarker(m)){
                        alert('Marker Deleted Successfully');
                        s.empty();
                        getMarkers(s);
                    }else{
                        alert('Error Removing Marker "' + m + '"');
                    }
                    break;
                }
            }
        }else{
            alert('Please Confirm The Delete Operation');
        }
    });

    $('.marker_edit button').on('click', function(){
        var s = $('.marker_edit select');
        var m = s.val();
        if(!m){
            alert('No Marker To Select');
            return;
        }
        for(var i=0; i<markers.length; i++){
            markers[i].setOptions({draggable: false, editable: false});
        }
        for(var i=0; i<markers.length; i++){
            if(markers[i].ID == m){
                if(updateMarker(m)){
                    alert('You Can Move The Marker');
                }else{
                    alert('Error Updating Marker "' + m + '"');
                }
                break;
            }
        }
    });

    /* Polygon Functions */


        
    function updatePolygon(m){
        for(var i=0; i<polygons.length; i++){
            if(polygons[i].get('name') == m){
                polygons[i].setOptions({editable: true, draggable: false});
                var clicked = false;
                google.maps.event.addListener(polygons[i], 'click', function(e){
                    if(!clicked){
                        this.setOptions({draggable: true});
                        clicked = !clicked;
                        alert('Please Click Again To Confirm OR Drag The Polygon If You Want');
                    }else{
                        this.setOptions({editable: false, draggable: false});
                        google.maps.event.clearListeners(this, 'click');
                    }
                });
                break;
            }
        }
    }

    function removePolygon(name){
        var index = undefined;
        for(var i=0; i<polygons.length; i++){
            if(polygons[i].get('name') == name){
                index = i;
                break;
            }
        }
        if(index !== undefined){
            polygons[index].setMap(null);
            polygons.splice(index, 1);
            return true;
        }
        return false;
    }   

    function polygonNameExists(name){
        for(var i=0; i<polygons.length; i++){
            if(polygons[i].get('name') == name){
                return true;
            }
        }
        return false;
    }
    function PolygonDisableInputs(){
        $('#polygon_name').prop('disabled', true);
        $('#polygon_stroke_color').prop('disabled', true);
        $('#polygon_stroke_weight').prop('disabled', true);
        $('#polygon_stroke_opacity').prop('disabled', true);
        $('#polygon_fill_color').prop('disabled', true);
        $('#polygon_fill_opacity').prop('disabled', true);
    }
    function PolygonEnableInputs(){
        $('#polygon_name').prop('disabled', false);
        $('#polygon_stroke_color').prop('disabled', false);
        $('#polygon_stroke_weight').prop('disabled', false);
        $('#polygon_stroke_opacity').prop('disabled', false);
        $('#polygon_fill_color').prop('disabled', false);
        $('#polygon_fill_opacity').prop('disabled', false);
    }

    function continueDrawingPolygon(Coordinates){
        polygon.setMap(null);
        points.push(new google.maps.LatLng(Coordinates.lat().toFixed(fixedNums), Coordinates.lng().toFixed(fixedNums)));
        var options = {
            path: points,
            strokeColor: $('#polygon_stroke_color').val(),
            strokeWeight: $('#polygon_stroke_weight').val(),
            strokeOpacity: $('#polygon_stroke_opacity').val(),
            fillColor: $('#polygon_fill_color').val(),
            fillOpacity: $('#polygon_fill_opacity').val(),
            editable: true,
            name: $('#polygon_name').val(),

        }
        polygon = new google.maps.Polygon(options);
        polygon.setMap(map);

        google.maps.event.addListener(polygon, 'click', function(index, obj) {
            this.setEditable(false);
            points = new google.maps.MVCArray();
            polygon = new google.maps.Polygon();
            polygons.push(this);
            firstDraw = true;
            PolygonEnableInputs();
            currentAction = false;
            google.maps.event.clearListeners(this, 'click');
            $('#polygon_stroke_color').val('#FF4848');
            $('#polygon_stroke_weight').val('3');
            $('#polygon_stroke_opacity').val('0.3');
            $('#polygon_fill_color').val('#7272FF');
            $('#polygon_fill_opacity').val('0.3');
            $('#polygon_name').val('');
        });


        google.maps.event.addListener(polygon, 'dragend', function(e){
            alert('Polygon Updated Successfully');
            this.setOptions({draggable: false, editable: false});
        });
    }

    function startDrawingPolygon(Coordinates){
        var name = $('#polygon_name').val();
        if(polygonNameExists(name)){
            alert('Please Choose Unique Polygon Name');
            return;
        }else if(name.length == 0){
            alert('Polygon Name Should Not Be Empty');
            return;
        }
        PolygonDisableInputs();

        points.push(new google.maps.LatLng(Coordinates.lat().toFixed(fixedNums), Coordinates.lng().toFixed(fixedNums)));
        var options = {
            path: points,
            strokeColor: $('#polygon_stroke_color').val(),
            strokeWeight: $('#polygon_stroke_weight').val(),
            strokeOpacity: $('#polygon_stroke_opacity').val(),
            fillColor: $('#polygon_fill_color').val(),
            fillOpacity: $('#polygon_fill_opacity').val(),
            editable: true,
            name: name
        }
        polygon = new google.maps.Polygon(options);
        polygon.setMap(map);
        firstDraw = false;
    }


    function getPolygons(s) {
        for(var i=0; i<polygons.length; i++){
            var e = '<option value="'+polygons[i].get('name') +'">' + polygons[i].get('name') + '</option>';
            s.append(e);
        }
    }
    
    $('#polygon_visibility, #polygon_delete, #polygon_edit').on('click', function(){
        var s = $('.'+$(this).attr('id')).find('select');
        s.empty();
        getPolygons(s);
    });

    $('.polygon_visibility button').on('click', function(){
        var m = $('.polygon_visibility select').val();
        if(!m){
            alert('No Polygon To Select');
            return;
        }
        var v = $('.polygon_visibility input[name=p_visibility]:checked').val();
        var b = v === 'false' ? false : true;
        if(polygonNameExists(m)){
            for(var i=0; i<polygons.length; i++){
                if(polygons[i].get('name') == m){
                    polygons[i].setVisible(b);
                    break;
                }
            }
        }else{
            alert('Polygon Name Not Found!');
        }
    });

    $('.polygon_delete button').on('click', function(){
        var s = $('.polygon_delete select');
        var m = s.val();
        if(!m){
            alert('No Polygon To Select');
            return;
        }
        if($('.polygon_delete input[name="p_confirm"]').is(':checked')){
            for(var i=0; i<polygons.length; i++){
                if(polygons[i].get('name') == m){
                    if(removePolygon(m)){
                        alert('Polygon Deleted Successfully');
                        s.empty();
                        getPolygons(s);
                    }else{
                        alert('Error Removing Polygon "' + m + '"');
                    }
                    break;
                }
            }
        }else{
            alert('Please Confirm The Delete Operation');
        }
    });

    $('.polygon_edit button').on('click', function(){
        var s = $('.polygon_edit select');
        var m = s.val();
        if(!m){
            alert('No Polygon To Select');
            return;
        }
        for(var i=0; i<polygons.length; i++){
            polygons[i].setOptions({draggable: false, editable: false});
        }
        for(var i=0; i<polygons.length; i++){
            if(polygons[i].get('name') == m){
                updatePolygon(m);
                alert('You Can Update The Polygon');
                break;
            }
        }
    });

    
    // Initialize the map    
    init();


});
