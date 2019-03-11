var app = angular.module('MyApp', [])
app.controller('MyController', function ($scope, $http, $window) {
    //Getting records from database.
    var post = $http({
        method: "POST",
        url: "/Home/GetCustomers",
        dataType: 'json',
        headers: { "Content-Type": "application/json" }
    });
    post.success(function (data, status) {
        //The received response is saved in Customers array.
        $scope.Customers = data;
    });

    //Adding new record to database.
    $scope.Add = function () {
        if (typeof ($scope.Name) == "undefined" || typeof ($scope.Country) == "undefined") {
            return;
        }
        var post = $http({
            method: "POST",
            url: "/Home/InsertCustomer",
            data: "{name: '" + $scope.Name + "', country: '" + $scope.Country + "'}",
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        });
        post.success(function (data, status) {
            //The newly inserted record is inserted into the Customers array.
            $scope.Customers.push(data)
        });
        $scope.Name = "";
        $scope.Country = "";
    };

    //This variable is used to store the original values.
    $scope.EditItem = {};

    //Editing an existing record.
    $scope.Edit = function (index) {
        //Setting EditMode to TRUE makes the TextBoxes visible for the row.
        $scope.Customers[index].EditMode = true;

        //The original values are saved in the variable to handle Cancel case.
        $scope.EditItem.Name = $scope.Customers[index].Name;
        $scope.EditItem.Country = $scope.Customers[index].Country;
    };

    //Cancelling an Edit.
    $scope.Cancel = function (index) {
        // The original values are restored back into the Customers Array.
        $scope.Customers[index].Name = $scope.EditItem.Name;
        $scope.Customers[index].Country = $scope.EditItem.Country;

        //Setting EditMode to FALSE hides the TextBoxes for the row.
        $scope.Customers[index].EditMode = false;
        $scope.EditItem = {};
    };

    //Updating an existing record to database.
    $scope.Update = function (index) {
        var customer = $scope.Customers[index];
        var post = $http({
            method: "POST",
            url: "/Home/UpdateCustomer",
            data: '{customer:' + JSON.stringify(customer) + '}',
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        });
        post.success(function (data, status) {
            //Setting EditMode to FALSE hides the TextBoxes for the row.
            customer.EditMode = false;
        });
    };

    //Deleting an existing record from database.
    $scope.Delete = function (customerId) {
        if ($window.confirm("Do you want to delete this row?")) {
            var post = $http({
                method: "POST",
                url: "/Home/DeleteCustomer",
                data: "{customerId: " + customerId + "}",
                dataType: 'json',
                headers: { "Content-Type": "application/json" }
            });
            post.success(function (data, status) {
                //Remove the Deleted record from the Customers Array.
                $scope.Customers = $scope.Customers.filter(function (customer) {
                    return customer.CustomerId !== customerId;
                });
            });
        }
    };
});