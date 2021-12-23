$(function() {
    $('.js-select2').select2({
        minimumResultsForSearch: -1,
        dropdownPosition: 'below'
    });
    /*--- Табы ---*/
    $('.js-tabs-container .js-tabs a').click(function() {

        let filter_class = $(this).attr('data-filter');

        let $parent = $(this).closest('.js-tabs-container');
        let filter_group = $parent.attr('data-filter-group')||'';
        $parent.find('>.js-tab-panel').hide();
        $parent.find('>.js-tab-panel').filter(filter_class).show();
        $parent.find('>.js-tab-panel').filter(filter_class).trigger('fui-tab-show');

        if (filter_group) {
            $parent.find('.js-tabs[data-filter-group="' + filter_group + '"] li').removeClass('state-active');
        }else {
            $parent.find('.js-tabs li').removeClass('state-active');
        }
        $(this).parent('li').addClass('state-active');

        return false;

    });

    /*--- Устанавливаем активный таб при загрузке страницы ---*/
    $('.js-tabs-container').each(function () {
        if (!$(this).find('.js-tabs li[data-filter=""]').length) $(this).find('.js-tabs li:first a:eq(0)').click();
    });
});