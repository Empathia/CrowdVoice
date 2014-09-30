Class('InfoTagsTooltip')({
  prototype: {
    init: (element) ->
      @element = if typeof element is 'string' then $(element) else element
      @element.data('neon', this) #set API

      #Components
      @voiceTags = @element.find '.voice-tags'
      @tagToolTip = @element.find '.tooltip'
      @applyButton = @element.find '.filter-apply-button'

      #var creation and collection
      @tagCheckBoxTemplate = '<li> <input type="checkbox" data-tag="{{tag}}"> {{tag}} </li>'
      #save vanilla url
      @cleanTagUrl = @applyButton.attr 'href'
      #if url has tags in it
      @initUrlParams = urlTags

      #create tag list
      for tag,i in infoboxTags
        @voiceTags.append @createTagCheckbox(tag)

      #create tooltip also check for scrollpane need
      # @tagToolTip.show().find('.voice-tags').jScrollPane()
      @tagToolTip.hide()
      #instantiate new tooltip look for cv/tooltip.js
      new Tooltip @element

      #in case of present tag parameter in url
      #check default tags
      for tag,i in @initUrlParams
        $('input:checkbox[data-tag="'+tag+'"]').prop('checked', true)
      
      #check default tags and build new apply url
      @addParamsToButton urlTags.join(',')

      @bindEvents()

    bindEvents: ->
      #bind checkboxes
      @voiceTags.find('input:checkbox').click =>
        @buildURL();
        
    createTagCheckbox: (tag) ->
      _.template @tagCheckBoxTemplate, {tag: tag}

    buildURL: ->
      activeTags=[];
      #check for checked boxes and extract tag
      @voiceTags.find('input:checked').each (i, el) =>
        activeTags.push $(el).attr('data-tag')
      
      #build new url with selected checkboxes
      @addParamsToButton activeTags.join(',')

    addParamsToButton: (params) ->
      #check if empty attibutes
      if params is ''
        @applyButton.attr('href', @cleanTagUrl.replace('?tags=', '?all=true'))
      else
        @applyButton.attr('href', @cleanTagUrl+params)
  }
})