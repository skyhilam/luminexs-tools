<template>
  <input type="text" />
</template>

<script>
export default {
  data() {
    return {
      autocomplete: null
    };
  },
  methods: {
    init() {
      const center = { lat: 22.1619078, lng: 113.5351334 };
      const autocomplete = new google.maps.places.Autocomplete(this.$el, {
        bounds: new google.maps.LatLngBounds(center),
        location: new google.maps.LatLng(center.lat, center.lng)
      });

      autocomplete.setFields([
        "address_component",
        // "formatted_address",
        // "name",
        // "vicinity",
        // "geometry"
      ]);

      autocomplete.addListener("place_changed", () => {
        this.placeChanged(autocomplete.getPlace());
      });

      $(this.$el).on("input", e => this.placeChanged({ name: e.target.value }));

      // const geolocation = {
      //     lat: 22.198745,
      //     lng: 113.543873
      // };
      // const circle = new google.maps.Circle({center: geolocation, radius: 1});
      // autocomplete.setBounds(circle.getBounds());

      // this.autocomplete = autocomplete
    },

    placeChanged(place) {
      this.$emit("input", this.$el.value);
      // this.$emit("input", place.name);
    },

    focus() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          const circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy
          });
          console.log(position.coords.accuracy);
          this.autocomplete.setBounds(circle.getBounds());
        });
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>
