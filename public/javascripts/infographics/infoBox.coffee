Class('InfoBox')({
  prototype: {
    #default sidebar off
    init: (infoboxData, template, sidebar) ->
      # @element = if typeof element is 'string' then $(element) else element
      # @element.data('neon', this) #set API
      @sidebarChart = sidebar
      @infoboxData = infoboxData
      @infoboxTemplate = $(template).html()

    render: ->
      
      @infobox = $( _.template( @infoboxTemplate, {data: @infoboxData} ) )

      if @infoboxData.type.indexOf('chart-') isnt -1 #is chart
        @infobox.find('.graphic').addClass @infoboxData.type
        new InfoChart( @infobox.find('.graphic.large')[0], @infoboxData ).chartInstance
        if @sidebarChart
          # console.log @sidebarChart
          new InfoChart( @infobox.find('.graphic.small')[0], @infoboxData, @sidebarChart ).chartInstance

      #Number character sizecheck
      if @infoboxData.number?
        if @infoboxData.number.length > 9
          @infobox.find('.graphic-number').addClass('smaller-number')



      # switch @infoboxData.type
      #   when 'clipart-image' || 'custom-image'
      #     @infobox.find('.graphic').append
      #return
      @infobox

    #   #render template, usign wraping object trick
    #   # infobox = $( _.template(@infoboxTemplate, {data: @infoboxData}) )

    #   #check for chart and replace image
    #   if @infoboxData.type.indexOf('chart-') > 0 
    #     chart = @buildChart()
    #     infobox.find('.graphic').content(chart)

    #   #return
    #   infobox

    # buildChart: ->
    #   chartNode = new InfoChart( @infoboxData ).el
  }
})