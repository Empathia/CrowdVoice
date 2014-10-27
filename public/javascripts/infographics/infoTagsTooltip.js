Class('InfoTagsTooltip')({
  prototype: {
    init: function(element) {
      var i, tag, _i, _j, _len, _len1, _ref;
      this.element              = typeof element === 'string' ? $(element) : element;
      this.element.data('neon', this);

      this.voiceTags            = this.element.find('.voice-tags');
      this.applyButton          = this.element.find('.filter-apply-button');
      this.tagCheckBoxTemplate  = '<li><label for="{{id}}"><input type="checkbox" data-tag="{{tag}}" id="{{id}}"> {{tag}} </label></li>';
      this.cleanTagUrl          = this.applyButton.attr('href');
      this.initUrlParams        = urlTags;

      //create tag list
      for (i = _i = 0, _len = infoboxTags.length; _i < _len; i = ++_i) {
        tag = infoboxTags[i];
        this.voiceTags.append(this.createTagCheckbox(tag, i));
      }
      new CVTooltip({
          element: this.element.find('.cv-tooltip')
      });
      _ref = this.initUrlParams;
      for (i = _j = 0, _len1 = _ref.length; _j < _len1; i = ++_j) {
        tag = _ref[i];
        $('input:checkbox[data-tag="' + tag + '"]').prop('checked', true);
      }
      this.addParamsToButton(urlTags.join(','));
      return this.bindEvents();
    },
    bindEvents: function() {
      var _this = this;
      if (isDevice) {
        this.applyButton.bind('click', function(){
          _this.element.trigger('tag.apply');
          $('.updating-wrapper').show();
        });
      }
      this.voiceTags.find('input:checkbox').click(function() {
        return _this.buildURL();
      });
    },
    createTagCheckbox: function(tag, id) {
      return _.template(this.tagCheckBoxTemplate, {
        tag: tag,
        id : id
      });
    },
    buildURL: function() {
      var activeTags,
        _this = this;
      activeTags = [];
      this.voiceTags.find('input:checked').each(function(i, el) {
        return activeTags.push($(el).attr('data-tag'));
      });
      return this.addParamsToButton(activeTags.join(','));
    },
    addParamsToButton: function(params) {
      if (params === '') {
        return this.applyButton.attr('href', this.cleanTagUrl.replace('?tags=', '?all=true'));
      } else {
        return this.applyButton.attr('href', this.cleanTagUrl + params);
      }
    }
  }
});
