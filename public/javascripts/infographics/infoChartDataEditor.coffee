Class('InfoChartDataEditor')({
  prototype: {
    init: (element, type, initData) ->
      @element = if typeof element is 'string' then $(element) else element
      
      @type = type

      #clean previous state and create markup
      @element.find('.grid-placeholder')
              .html('')
              .append(@element.find('.data-grid-template').html())

      #CONFIG
      @maxGridSize = 200
      @valid = no #default validation 

      #declared app/views/admin/blocks/on _form.html.erb
      @voiceColors = voiceColors #automatic chart colors

      # Templates & containers collection

      #row container
      @rowTitles = @element.find('.series-data')
      #template
      @rowTitleColorTmpl = @element.find('.data-row-template').html()

      #column container
      @colTitles = @element.find('.col-titles')
      #template
      @colTitleTmpl = @element.find('.col-title-template').html()

      #data grid container
      @dataGrid = @element.find('.series-rows')
      #data rows container template
      @dataRowTmpl = @element.find('.row-data-template').html()
      #template
      @dataTmpl = @element.find('.data-template').html()

      #dataGridScroll
      @gridScroll = @element.find('.series-rows-container')
      @colScroll = @element.find('.col-titles-container')
      @rowScroll = @rowTitles

      #Elements
      #scroll container title cols
      @colMask = @element.find('.col-titles-mask')

      #buttons
      @addRow = @element.find('.add-row')
      @addCol = @element.find('.add-col')

      #max-min range
      @rangeMin = @element.find('.from-to input.from')
      @rangeMax = @element.find('.from-to input.to')

      #layout dropdown
      @layout = @element.find('.chart-layout')

      #Select correct type of form
      switch @type
        when 'chart-radial'
          @setupRadial()

        when 'chart-hbars'
          @setupHBars()

        when 'chart-area'
          @setupArea()

      #set default values
      @setAutoColors()
      @fillAutoColors()

      #adjust sizes if needed
      @setSizes()

      @bindEvents()

      #check for edit mode
      if initData
        @initData = initData
        @setupEditMode()

      #show the actual controls
      @element.show()

      #return element
      @this

    setAutoColors: ->
      #automatic colors
      @autoColors =  @element.find('.color-check').prop('checked', true) #use auto colors by default
      @rowTitles.find('.color').prop('disabled', true).addClass('disabled') #disable color inputs
      @useAutoColors = true #flag

    fillAutoColors: ->
      k = 0
      @rowTitles.find('.color').each (i, el) =>
        $(el).val( @voiceColors[k] )
        k++ #next color
        if k is @voiceColors.length then k = 0 #restar list iterator

    #edition mode
    loadContent: ->

    bindEvents: ->
      that = this

      @addCol.click =>
        @addColumn()

      @addRow.click =>
        @addSerie()

      # sync scroll bars
      @gridScroll.scroll (e) =>
        @colScroll.scrollLeft @gridScroll.scrollLeft()
        @rowScroll.scrollTop @gridScroll.scrollTop()

      @colTitles.delegate '.remove-col', 'click', ->
        colToRemove = $(this).parent('.col-title').remove().attr('data-col')
        that.gridScroll.find("[data-col=\"#{colToRemove}\"]").remove()
        that.setSizes()
        that.resetGridCoords()  
        that.element.trigger 'change'

      @rowTitles.delegate '.remove-row', 'click', ->
        rowToRemove = $(this).parent('.data-row').remove().attr('data-row')
        that.gridScroll.find("[data-row=\"#{rowToRemove}\"]").remove()
        that.setSizes()
        that.resetGridCoords()
        #check for auto colors and fill them
        if that.useAutoColors
          that.fillAutoColors()
        that.element.trigger 'change'

      @autoColors.change =>
        if @autoColors.prop('checked')
          @enableAutoColors()
        else
          @disableAutoColors()
          

    enableAutoColors: ->
      @rowTitles.find('.color').prop('disabled', true).addClass('disabled')
      @useAutoColors = true
      @fillAutoColors()

    disableAutoColors: ->
      @rowTitles.find('.color').prop('disabled', false).removeClass('disabled')
      @useAutoColors = false

    addColumn: (name) ->
      that = this

      colName = $(@colTitleTmpl)

      #in case of edit mode
      if name?
        colName.find('.col-name').val(name)

      @colTitles.append colName
            
      @dataGrid.children().each ->
        $(this).append that.dataTmpl

      @setSizes()
      @resetGridCoords()
      @element.trigger 'change'

    addSerie: (name, color) ->
      that = this

      title = $(@rowTitleColorTmpl)

      #check for auto colors
      if @useAutoColors
        title.find('.color').prop('disabled', true).addClass('disabled')

      if name? #edition mode
        title.find('input.name').val name
        title.find('input.color').val color

      @rowTitles.append title

      #check for auto colors and fill them
      if @useAutoColors
        @fillAutoColors()

      newRow = $(@dataRowTmpl)

      for i in @colTitles.children()
        newRow.append @dataTmpl

      @dataGrid.append newRow

      @setSizes()
      @resetGridCoords()
      @element.trigger 'change'

    setSizes: ->
      #adjust col titles and grid rows
      columns = @colTitles.children().length
      colwidth = @colTitles.children(':eq(0)').width()

      totalWidth = columns * colwidth

      @colTitles.width totalWidth

      @dataGrid.children().each ->
        $(this).width totalWidth

      if totalWidth > @maxGridSize
        @colScroll.width @maxGridSize
        @colMask.width @maxGridSize
      else
        @colScroll.width totalWidth
        @colMask.width totalWidth

    resetGridCoords: ->
      @colTitles.children().each (i,el) ->
        $(this).find('.col-order').html( String.fromCharCode(i+65) ) #create A,B,C.. indexes
        $(this).attr('data-col', i)

      @rowTitles.children().each (i,el) ->
        $(this).attr('data-row', i)

      @dataGrid.children().each (i,el) ->
        $(this).attr('data-row', i).children().each (j, el) ->
          $(this).attr('data-row', i).attr('data-col', j)

      #only for area charts, check if Z has been reached and lock the columns
      if @type is 'chart-area'
        if @colTitles.children().length is 26
          @addCol.hide()
        else
          @addCol.show()

    setupRadial: ->
      #hide add column control
      @addCol.hide()

      #add only one column
      firtsColTitle = $(@colTitleTmpl).addClass('first')
      firtsColTitle.find('.remove-col').remove()
      @colTitles.append firtsColTitle

      # hide column titles
      @colMask.hide()
      @element.find('.values-label').show()

      #add one row without remove button
      firstRowTitle = $(@rowTitleColorTmpl).addClass('first')
      firstRowTitle.find('.remove-row').remove()
      @rowTitles.append( firstRowTitle )

      #add one grid input
      @dataGrid.append( $(@dataRowTmpl).append @dataTmpl )

      #reset numbering
      @resetGridCoords()

    setupHBars: ->
      #radial and hbars use the same setup
      @setupRadial()

      #remove layout options
      @layout.find('[value="chart-left"]').remove()

      @element.find('.from-to').show()
      
    setupArea: ->
      @element.find('.from-to').show()

      #add only one column
      firtsColTitle = $(@colTitleTmpl).addClass('first')
      firtsColTitle.find('.remove-col').remove()
      @colTitles.append firtsColTitle

      #add one row without remove button
      firstRowTitle = $(@rowTitleColorTmpl).addClass('first')
      firstRowTitle.find('.remove-row').remove()
      @rowTitles.append firstRowTitle

      #add one grid input
      @dataGrid.append( $(@dataRowTmpl).append @dataTmpl )

      #remove layout options
      @layout.find('[value="chart-left"]').remove()

      #reset numbering
      @resetGridCoords()

    getData: ->
      #empty result
      result = {chartData:{yAxis:{}, xAxis:[], labels:[], colors:[]}, layout:''}
      switch @type
        when 'chart-radial'
          radial = []
          #get data from first column only
          for el, i in @rowTitles.children()
            slice = []
            input = @dataGrid.find(".data[data-row=\"#{i}\"][data-col=\"0\"]")
            
            #validation
            if parseInt( input.val() ) > 0 or parseInt( input.val() ) < 0
              input.removeClass('error')
              @valid = yes
            else
              input.addClass('error')
              @valid = no

            #old approach
            # radial.push parseInt input.val()
            
            #new approach
            slice[0] = $(el).find('.name').val()
            slice[1] = parseFloat input.val()

            radial.push slice

            result.chartData.labels.push $(el).find('.name').val() #row names
            result.chartData.colors.push $(el).find('.color').val() #row color

          result.chartData.values = [{data:radial}]

        when 'chart-hbars'

          #get data from first column only
          hbars = [{data:[]}]
          for el, i in @rowTitles.children()
            bar = []
            input = @dataGrid.find(".data[data-row=\"#{i}\"][data-col=\"0\"]")
            
            #validation
            if parseInt( input.val() ) > 0 or parseInt( input.val() ) < 0
              input.removeClass('error')
              @valid = yes
            else
              input.addClass('error')
              @valid = no
            
            
            val = parseFloat input.val()
            bar[0] = $(el).find('.name').val()
            bar[1] = val

            hbars[0].data.push bar

            result.chartData.labels.push $(el).find('.name').val() #row names
            result.chartData.colors.push $(el).find('.color').val() #row color

          result.chartData.values = hbars
          
          if @rangeMax.val() isnt ''
            result.chartData.yAxis = {max: parseInt( @rangeMax.val() )}

        when 'chart-area'
          #get data from all columns per row
          area = []
          for elRow, i in @rowTitles.children()
            row = for el, k in @colTitles.children()
              input = @dataGrid.find(".data[data-row=\"#{i}\"][data-col=\"#{k}\"]")

              #validation
              if parseFloat( input.val() ) > 0 or parseInt( input.val() ) < 0
                input.removeClass('error')
                @valid = yes
              else
                input.addClass('error')
                @valid = no
              
              #for array buid
              parseInt input.val()
            
            area.push {data:row}
            result.chartData.labels.push $(elRow).find('.name').val() #row names
            result.chartData.colors.push $(elRow).find('.color').val() #row color

          result.chartData.values = area

          #ranges
          if @rangeMax.val() isnt ''
            result.chartData.yAxis = {max: parseInt( @rangeMax.val() )}
          
          #column names
          for el, i in @colTitles.children()
            result.chartData.xAxis.push $(el).find('.col-name').val()
        
      result.layout = @layout.val()

      # return
      result
    
    setupEditMode: ->
      #assign all values from data
      @autoColors.prop('checked', false)
      @disableAutoColors()

      #ranges
      @rangeMin.val @initData.chartData.yAxis.min
      @rangeMax.val @initData.chartData.yAxis.max

      #column names
      for name, i in @initData.chartData.xAxis
        if i is 0 #use the already placed column by setup rutine
          @colTitles.find('.col-name').val(name)
        else
          @addColumn name
      
      #row names & colors
      for name, i in @initData.chartData.labels
        if i is 0 #use the already placed column by setup rutine
          @rowTitles.find('input.name').val name
          @rowTitles.find('input.color').val @initData.chartData.colors[i]
        else
          @addSerie name,@initData.chartData.colors[i]

      #grid data reading
      if @initData.type is 'chart-radial' or @initData.type is 'chart-hbars' #radial special case
        for value, i in @initData.chartData.values[0].data
          @dataGrid.find(".data[data-row=\"#{i}\"][data-col=\"0\"]").val value[1]
      else
        for row, i in @initData.chartData.values
          for value, k in row.data
            @dataGrid.find(".data[data-row=\"#{i}\"][data-col=\"#{k}\"]").val value

      #layout dropdown
      @layout.val @initData.layout

  }
})