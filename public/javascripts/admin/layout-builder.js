$(function() {
    window.layoutBuilder = {
        $doc : $(document),
        $win : $(window),
        autoCompleteVoiceWidget : $( 'form.recent-featured .voicesAutoComplete' ),
        autoCompleteEventWidget : $( 'form.graph-event .voicesAutoComplete' ),
        selectableWidget : $('.selectable'),
        isDisabled: function () {
            var that = this;
            that.autoCompleteVoiceWidget.autocomplete( 'option', 'disabled' );
        },
        feedForm: function (id) {
            var that = this,
                voice_id;

            for( var i = 0, len = allItems.length; i < len; i++ ) {
                voice_id = allItems[i].id;
                var form = $('#edit_layout_item_'+voice_id);
                form.find('.voicesAutoComplete').val(allItems[i].name);
                form.find('.li-'+allItems[i].type).addClass('ui-selected');
                form.find('.selectable').selectable( "disable" );
            }
        },
        bindEvents: function () {
            var that = this;
            that.selectableWidget.selectable({
                selected: function( event, ui ) {
                    var selectedEle = $(ui.selected),
                        selectedVal = ui.selected.dataset.value;

                    selectedEle
                        .siblings()
                        .removeClass('ui-selected');

                    selectedEle
                        .closest('form')
                        .find('input.item_type')
                        .val(selectedVal);
                }
            });
            // initialize Voices Autocomplete
            for (var i=0; i < that.autoCompleteVoiceWidget.length; i++)
            {

                $(that.autoCompleteVoiceWidget[i]).autocomplete({
                    minLengthType: 4,
                    source: allVoices,
                    focus: function (event, ui) {
                        this.value = ui.item.label;
                        return false;
                    },
                    select: function( event, ui ) {
                        var textInput = $(this),
                            selectable = textInput.closest('form').find('.selectable');
                        this.value = ui.item.label;
                        this.nextElementSibling.value = ui.item.id;

                        selectable.selectable( "enable" );
                        return false;
                    }
                }).data("autocomplete")._renderItem = function (ul, item) {

                        return $("<li>")
                        .data("item.autocomplete", item)
                        .append("<a>" + item.label + "</a>")
                        .appendTo(ul);
                };

                if ( $(that.autoCompleteVoiceWidget[i]).siblings('.item_voice_id').val().length ) {
                    that.feedForm( $(that.autoCompleteVoiceWidget[i]).siblings('.item_voice_id').val() );
                }
            };
            // Initialize Features Autocomplete
            for (var i=0; i < that.autoCompleteEventWidget.length; i++)
            {
                $(that.autoCompleteEventWidget[i]).autocomplete({
                    minLengthType: 4,
                    source: allVoices,
                    focus: function (event, ui) {
                        if (ui.item.has_infograph === false && ui.item.has_backstory === false) {
                            this.value = "Voice can't be selected...";
                            return;
                        } else {
                            this.value = ui.item.label;
                            return false;
                        }
                    },
                    select: function( event, ui ) {
                        var textInput = $(this),
                            selectable = textInput.closest('form').find('.selectable');

                        textInput.closest('form').find('button').removeAttr('disabled');
                        if ( ui.item.has_backstory === false && ui.item.has_infograph === true ) {

                            selectable
                                .find('.li-backstory')
                                .removeClass('ui-selected')
                                .siblings()
                                .addClass('ui-selected')
                                .closest('.selectable')
                                .data("selectable")._mouseStop(null);

                            this.value = ui.item.label;
                            this.nextElementSibling.value = ui.item.id;
                            selectable.selectable( "disable" );
                            textInput.siblings('.item_type').val('graph');
                            return;

                        } else if ( ui.item.has_backstory === true && ui.item.has_infograph === false ) {

                            selectable
                                .find('.li-graph')
                                .removeClass('ui-selected')
                                .siblings()
                                .addClass('ui-selected')
                                .closest('.selectable')
                                .data("selectable")._mouseStop(null);

                            this.value = ui.item.label;
                            this.nextElementSibling.value = ui.item.id;
                            selectable.selectable( "disable" );
                            textInput.siblings('.item_type').val('backstory');
                            return;

                        }
                        selectable.selectable( "enable" );

                        if (ui.item.has_infograph === false && ui.item.has_backstory === false) {
                            this.value = "Voice can't be selected...";
                            $(this).closest('form').find('button').attr('disabled', 'disabled');
                            return false;
                        } else {
                            this.value = ui.item.label;
                            this.nextElementSibling.value = ui.item.id;
                            $(this).closest('form').find('button').removeAttr('disabled');
                            return false;
                        }
                    }
                }).data("autocomplete")._renderItem = function (ul, item) {
                    var graph, backstory;
                    if (item.has_infograph === true) {
                        graph = {
                          'class': 'infograph-enabled',
                          'title': 'Infograph Exist'
                        };
                    } else {
                        graph = {
                          'class': 'infograph-disabled',
                          'title': "No Info-Graph Found"
                        };
                    }

                    if (item.has_backstory === true) {
                        backstory = {
                          'class': 'backstory-enabled',
                          'title': 'Backstory Exist'
                        };
                    } else {
                        backstory = {
                          'class': 'backstory-disabled',
                          'title': 'No Backstory Found'
                        };
                    }
                    if ( graph.class ===  'infograph-disabled' && backstory.class === "backstory-disabled" ) {
                        return $("<li>")
                            .data("item.autocomplete", item)
                            .append("<a class='ui-state-disabled' disabled='disabled'>" + item.label + "</a>" + "<div class='voice-info'><i class='icn-voice " + graph.class + "' title='" + graph.title + "'></i><i class='icn-voice " + backstory.class + "' title='" + backstory.title + "'></i></div>")
                            .appendTo(ul);
                    } else {
                        return $("<li>")
                        .data("item.autocomplete", item)
                        .append("<a>" + item.label + "</a>" + "<div class='voice-info'><i class='icn-voice " + graph.class + "' title='" + graph.title + "'></i><i class='icn-voice " + backstory.class + "' title='" + backstory.title + "'></i></div>")
                        .appendTo(ul);
                    }
                }

                if ( $(that.autoCompleteEventWidget[i]).siblings('.item_voice_id').val().length ) {
                    that.feedForm( $(that.autoCompleteEventWidget[i]).siblings('.item_voice_id').val() );
                }
            };

        }
    };
});

$(document).ready(function() {
    'use strict';
    window.layoutBuilder.bindEvents();
});