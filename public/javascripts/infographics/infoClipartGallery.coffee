Class('InfoClipartGallery')({
  prototype: {
    init: (element, initData, numberCombination) ->
      @element = if typeof element is 'string' then $(element) else element

      @template = @element.find('.clipart-template').html()

      @element.find('.clipart-placeholder').html('').append @template

      @gallery = @element.find('.clipart-panel')

      @layout = @element.find('.clipart-layout')
      @layoutOptions = @element.find('.layout-options')

      @bindEvents()

      if initData
        @initData = initData
        @setEditionMode()
      else
        #set default image
        @selectImage @gallery.children(':eq(0)').attr('data-clipart-url')

      if numberCombination
        @layoutOptions.hide()

      @element.show()

    bindEvents: ->
      @gallery.delegate '.clipart-sample', 'click', (e) =>
        @selectImage($(e.target).parents('.clipart-sample').attr('data-clipart-url'))

    selectImage: (selectedId) ->
      selectedNode = @gallery.find("[data-clipart-url=\"#{selectedId}\"]")
  
      #clan previously selected
      @gallery.children().each ->
        $(this).removeClass('selected')
      #select curent
      selectedNode.addClass('selected')

      @selectedUrl = selectedNode.attr('data-clipart-url')

      @element.trigger 'infoEditorChange.clipart'

    setEditionMode: ->
      @selectImage( @initData.graphic )
      #layout dropdown
      @layout.val @initData.layout

    getData: ->
      result = 
        graphic: @selectedUrl
        layout: @layout.val()

  }
})