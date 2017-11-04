*models/costume.js*

  Defines a costume with a name (string - required), profile (string) and parts(ObjectId) property.
  parts contains ref to an accessory

*models/accesory.js*

  Defines an accessory with a parts(array) property that contains strings.

*routes/**

  Both costume-routes.js and accessory-routes define the following endpoints

  _GET/api/1.0/[costume/accessory]/:id_   

     Returns a resource by specified ID. If not match, returns 404

  _GET/api/1.0/[costumes/accessories]_   

     Returns all resources

  _POST/api/1.0/[costume/accessory]_   

     Returns resource.

  _PUT/api/1.0/[costume/accessory]/:id_   

     Updates resource with specified ID. If invalid ID is provided, will return 404

  _DELETE/api/1.0/[costume]/:id_   

     Deletes resource with specified ID. Returns 500 upon error.
