var MERCATO = MERCATO || {};
MERCATO.Admin  = MERCATO.Admin || {};
MERCATO.Admin.AllShipments  = MERCATO.Admin.AllShipments || {};

MERCATO.Admin.AllShipments = {
    getShipmentTable: function ( page )
    {
        var type = document.getElementById("sltShipmentStatus").value;
        $.ajax({
            url: "/admin/shipment/"+type+"/?page="+page+"&size="+MERCATO.Admin.AllShipments.pageSize,
            type: 'GET'
        })
        .done( function( response )
            {

            });
    },
    onPageSizeChanged: function( element )
    {
        MERCATO.Admin.AllShipments.pageSize = parseInt( element.value );
        MERCATO.Admin.AllShipments.drawNavigationBar( 1, true );
        console.log("redraw");
    },
    onStatusSelectionChanged: function (element)
    {
        console.log(element.value);
        $.ajax({
            //TODO: Change the API to get only the count here. redrawing the navigation bar will fetch the data.
            url: "/admin/shipment/"+element.value+"/?page="+1+"&size="+MERCATO.Admin.AllShipments.pageSize,
            type: 'GET'
        })
        .done( function( response )
        {
            MERCATO.Admin.AllShipments.drawNavigationBar( 1, true );
            console.log(MERCATO.Admin.AllShipments.pages);
        });
    },
    drawNavigationBar: function( startPage, redraw )
    {
        MERCATO.Admin.AllShipments.calculatePages();
        console.log(MERCATO.Admin.AllShipments.pages);
        var navigationBar = $('#ulPageNavigation');
        if( redraw == true )
        {
            navigationBar.twbsPagination('destroy');
        }
        if( MERCATO.Admin.AllShipments.pages > 0)
        {
            navigationBar.twbsPagination(
                {
                    totalPages: MERCATO.Admin.AllShipments.pages,
                    visiblePages: 7,
                    startPage: MERCATO.Admin.AllShipments.pages < startPage ? MERCATO.Admin.AllShipments.pages : startPage,
                    onPageClick: function (event, page)
                    {
                        MERCATO.Admin.AllShipments.getShipmentTable( page );
                    }
                });
        }
    },
    calculatePages: function()
    {
        MERCATO.Admin.AllShipments.pages = (MERCATO.Admin.AllShipments.totalCount / MERCATO.Admin.AllShipments.pageSize) +
            (MERCATO.Admin.AllShipments.totalCount % MERCATO.Admin.AllShipments.pageSize == 0 ? 0 : 1);
    },
    changeShipmentStatus: function( element )
    {
        var elementId = element.parentNode.id;
        var index = elementId.split("-")[1];
        var shipmentId = $("#tdShipmentId-"+index).text();
        var shipmentStatus = $("#tdStatus-"+index).text();

        var shipmentChange = {
            "PICKED": "PACKED",
            "PACKED": "SHIPPED"
        };
        $.ajax({
            url: "/admin/shipment/" + shipmentId + ".json?status="+shipmentChange[shipmentStatus],
            type: 'POST'
        })
            .done( function( response )
            {
                console.log(response);
                var currentPage = $('#ulPageNavigation').twbsPagination('getCurrentPage');
                MERCATO.Admin.AllShipments.drawNavigationBar( currentPage, true );

                MERCATO.Utils.showToastMessage("Shipment status changed", "SUCCESS");
            })
            .fail( function( response )
            {
                console.log("Failure - Code: " + response["status"]);
                console.log("Failure - Message: " + response["responseText"]);
                MERCATO.Utils.showToastMessage('Exception "' + response["responseText"] + '" occurred while trying to change shipment status!', "ERROR");
            });
    }
};