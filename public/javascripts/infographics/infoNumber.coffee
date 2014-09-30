Class('InfoNumber')({
  prototype: {
    init: (element, initData, graphicCombination) ->
      @element = if typeof element is 'string' then $(element) else element

      @template = @element.find('.number-template').html()

      @element.find('.number-placeholder').html('').append @template

      @numberInput = @element.find('#block_number')

      @bindEvents()

      if initData
        @initData = initData
        @setEditionMode()

      if graphicCombination
        @layout = 'number-graphic-top'
      else
        @layout = 'number-top'

      @element.show()

    bindEvents: ->


    setEditionMode: ->
      @numberInput.val(initData.number)
      # @uploadInput.change =>
      #   @uploadImage()

    getData: ->
      result =
        number: @numberInput.val()
        layout: @layout
      
  }
})