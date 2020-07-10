(function () {
    $(document).ready(function () {
        if (!Modernizr.input.placeholder) {
            $("[placeholder]").focus(function () {
                var input;
                input = $(this);
                if (input.val() === input.attr("placeholder")) {
                    input.val("");
                    return input.removeClass("placeholder");
                }
            }).blur(function () {
                var input;
                input = $(this);
                if (input.val() === "" || input.val() === input.attr("placeholder")) {
                    input.addClass("placeholder");
                    return input.val(input.attr("placeholder"));
                }
            }).blur();
            return $("[placeholder]").parents("form").submit(function () {
                return $(this).find("[placeholder]").each(function () {
                    var input;
                    input = $(this);
                    if (input.val() === input.attr("placeholder")) {
                        return input.val("");
                    }
                });
            });
        }
    });
}).call(this);