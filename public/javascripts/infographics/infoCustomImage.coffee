Class('InfoCustomImage')({
  prototype: {
    init: (element, initData, numberCombination) ->
      @element = if typeof element is 'string' then $(element) else element

      @customimageUrl = '/images/image-place-holder.png'

      @template = @element.find('.custom-image-template').html()

      @element.find('.custom-image-placeholder').html('').append @template

      @thumbContainer = @element.find('.thumb-container')
      @imageThumb = @element.find('.image-thumb')
      @layoutOptions = @element.find('.layout-options')

      @uploadInput = @element.find('.image-preview')

      @layout = @element.find('.graphic-layout')

      #assign image placeholder
      @imageThumb.attr 'src', @customimageUrl

      @bindEvents()

      if initData
        @initData = initData
        @setEditionMode()

      if numberCombination
        @layoutOptions.hide()

      @element.show()

    bindEvents: ->
      @uploadInput.change =>
        @uploadImage()

    uploadImage: ->
      @uploadInput.upload '/admin/image_preview',
        (data) =>
          @thumbContainer.show()
          @imageThumb.attr 'src', data.url
          @element.trigger 'infoEditorChange.custom-image'
          @customimageUrl = data.url
        'json'

      #   dataType: 'json',
      #   done: (e, data) ->
      #       console.log data

      # @uploadForm.submit()

    setEditionMode: ->
      @thumbContainer.show()
      @imageThumb.attr('src', @initData.graphic)
      @customimageUrl = @initData.graphic
      #layout dropdown
      @layout.val @initData.layout

    getData: ->
      result = 
        graphic: @customimageUrl
        layout: @layout.val()

  }
})