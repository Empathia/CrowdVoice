Class('JsonForm')({
    prototype: {
        init: function(element, onSuccess) {
            this.element = typeof element == 'string' ? $(element) : element;
            this.onSuccess = onSuccess;
            this._bindEvents();
        },

        _bindEvents: function () {
            var that = this;
            this.element.bind('submit', function () {
                that.submit($(this));
                return false;
            });
        },

        submit: function (form) {
            var that = this;
            this.clearErrors();
            $.ajax({
                url: form.attr('action'),
                data: form.serialize(),
                type: 'post',
                dataType: 'json',
                success: function (data) {
                    that.handleSuccess(data, form);
                },
                error: function (xhr) {
                    that.clearErrors();
                    $(".btn-success").removeAttr("disabled");
                    that.handleError(eval('(' + xhr.responseText + ')'));
                }
            });
        },

        clearErrors: function () {
            this.element.find('.help-inline').remove();
            this.element.find('.error').removeClass('error');
        },

        handleSuccess: function (data, form) {
            if(this.onSuccess) {
                this.onSuccess(data, form);
            }
        },

        handleError: function (errors) {
            var tpl = '%s';
            for (var attr in errors) {
                if(errors.hasOwnProperty(attr)) {
                    if(attr == 'base') {
                        this.element.find('tbody').append(
                            tpl.replace(/%s/g, errors[attr])
                        );
                    } else {
                        this.element.find('[data-attribute=' + attr + ']')
                        .addClass('error').val('').attr('placeholder', tpl.replace(/%s/g, attr + ' ' + errors[attr][0]));
                        this.element.find('[data-attribute=' + attr + ']')
                            .closest('.control-group').addClass('error');
                    }
                }
            }
        }
    }
});
