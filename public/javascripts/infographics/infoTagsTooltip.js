Class('InfoTagsTooltip')({
  prototype: {
    init: function(element) {
      var i, tag, _i, _j, _len, _len1, _ref;
      this.element              = typeof element === 'string' ? $(element) : element;
      this.element.data('neon', this);

      this.voiceTags            = this.element.find('.voice-tags');
      this.tagCheckBoxTemplate  = '<li><label for="{{id}}"><input type="checkbox" data-tag="{{tag}}" id="{{id}}"> {{tag}} </label></li>';

      //create tag list
      for (i = _i = 0, _len = infoboxTags.length; _i < _len; i = ++_i) {
        tag = infoboxTags[i];
        this.voiceTags.append(this.createTagCheckbox(tag, i));
      }
      new CV.Tooltip({
          element: this.element.find('.cv-tooltip')
      });

      return this;
    },
    createTagCheckbox: function(tag, id) {
      return _.template(this.tagCheckBoxTemplate, {
        tag: tag,
        id : id
      });
    }
  }
});
