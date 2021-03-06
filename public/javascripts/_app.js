/**
 * Plain JS function to disable inputs before jQuery is loaded
 * @return {Bool} true
 */
var enableInputs = function(){
  document.getElementsByClassName("submit")[0].classList.add('enabled');
  document.getElementsByClassName("submit")[0].classList.remove('disabled');
  return true;
}

/**
 * Plain JS function to disable inputs before jQuery is loaded
 * @return {Bool} true
 */
var disableInputs = function(){
  document.getElementsByClassName("submit")[0].classList.add('disabled');
  document.getElementsByClassName("submit")[0].classList.remove('enabled');
  return true;
}

$(function() {
  /**
   * check if the current page is being loaded
   * via an frame
   * @return {Bool}
   */
  var inIframe = function() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  /**
   * Toggle the TLD/package form (dropdown)
   * @param  {String} state "hide" or "show"
   * @return {Boolean}
   */
  var toggleMultiLookupForm = function(state){
    if (state === 'show') {
      // Remove 'single', add 'multi' CSS class
      $('form').removeClass('single').addClass('multi');
      // Show tld-package dropdown
      $('#tld-package').show();
      // Show '.' input group addon
      $('#dot').show();
      // Remove round corners from "your-domain" input
      $('#your-domain').css("border-top-right-radius","0px");
      $('#your-domain').css("border-bottom-right-radius","0px");
      return true;
    } else if (state === 'hide') {
      // Remove 'multi', add 'single' CSS class
      $('form').removeClass('multi').addClass('single');
      // Hide tld-package dropdown
      $('#tld-package').hide();
      // Hide '.' input group addon
      $('#dot').hide();
      // Add round corners for "your-domain" input
      $('#your-domain').css("border-top-right-radius","4px");
      $('#your-domain').css("border-bottom-right-radius","4px");
      return true;
    } else {
      return false;
    }
  }

  /**
   * Toggle (show and hide) the lookup
   * results table
   * @param  {String} state "hide" or "show"
   * @return {Boolean}
   */
  var toggleResultsTable = function (state){
    if (state === 'show') {
      $('.lookup-results').show();
      return true;
    } else if (state === 'hide') {
      $('.lookup-results').hide();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Function to lookup a single domain
   * name via GET /api/lookup/single/{domain}
   * @return {Boolean} true
   */
  var submitSingleLookup = function(callback){
    var domain = $('#your-domain').val();

    var postParameter = {
      domain: domain
    };

    // If captcha is enabled
    if($('.captcha').length > 0){
      postParameter['g-recaptcha-response'] = $('.g-recaptcha-response').val();
    }

    $.post( 'api/lookup/domain', postParameter, function( data ){
      return callback(data);
    });
  }

  /**
   * Function to lookup a multiple domains (TLDs)
   * via POST /api/lookup/mutli
   * @return {Boolean} true
   */
  var submitMultiLookup = function(callback){
    var domain = $('#your-domain').val(),
        package = $("select.form-control option:selected").text();

    var postParameter = {
      domain: domain,
      package: package
    };

    // If captcha is enabled
    if($('.captcha').length > 0){
      postParameter['g-recaptcha-response'] = $('.g-recaptcha-response').val();
    }

    $.post( 'api/lookup/package', postParameter, function( data ) {
      return callback(data);
    });
 }

 /**
   * Fill lookup results in <table>
   * @param  {Object} data result data
   * @return {Object} jQuery object
   */
  var populateResultTable = function(data){
    var htmlData = {};

    // For each domain lookup result
    for (var domain in data) {
      // Check for success
      if (data[domain].status === 'success') {
        // Append new table <tr> in htmlData
        if (data[domain].available === true ) {
          htmlData += '<tr data-domain="' + domain + '" data-available="available"><th scope="row">' + domain + '</th><td class="text-center"><span class="label label-success"><span class="glyphicon glyphicon-ok"></span></span></td><td class="text-center"><input type="checkbox" value=""></td></tr>';
        } else {
          htmlData += '<tr data-domain="' + domain + '" data-available="unavailable"><th scope="row">' + domain + '</th><td class="text-center"><span class="label label-danger"><span class="glyphicon glyphicon-remove"></span></span></td><td class="text-center"><input type="checkbox" value="" disabled></td></tr>';
        }
      } else {
        htmlData += '<tr data-domain="' + domain + '" data-available="error"><th scope="row">' + domain + ' (' + data[domain].message + ')</th><td class="text-center"><span class="label label-danger"><span class="glyphicon glyphicon-remove"></span></span></td><td class="text-center"><input type="checkbox" value="" disabled></td></tr>';
      }
    }

    return $('.lookup-results table tbody').html(htmlData);
  }

  /**
   * Display given error message in Bootstrap alert
   * @param  {String} msg
   * @return {Object} jQuery object
   */
  var displayErrorMessage = function(msg){
    $('div.error-container').html('<div class="alert alert-danger" role="alert"><strong>Error</strong>: ' + msg + ' </div>');

    return toggleErrorContainer('show');
  }

  /**
   * Toggle error container
   * @param  {String} state "hide" or "show"
   * @return {Boolean}
   */
  var toggleErrorContainer = function (state){
    if (state === 'show') {
      $('.error-container').show();
      return true;
    } else if (state === 'hide') {
      $('.error-container').hide();
      return true;
    } else {
      return false;
    }
  }

  // Insert the first domain package in the hidden input
  var defaultTlds = $('#dropdownmenu > li').first().data('tlds');

  // Hide loading spinner on page load
  toggleResultsTable('hide');

  // Request lookup, when single form is active
  $('.row').on('click', 'form.single .submit', function(e){
    // Hide lookup results table and error container
    toggleResultsTable('hide');
    toggleErrorContainer('hide');

    // Create ladda (loading spinner) instance and start spinning
    var ladda = Ladda.create(this);
    ladda.start();

    submitSingleLookup(function(cb){
      if (cb.status === 'success') {
        // Populate result table with API response data
        populateResultTable(cb.data);

        // Show lookup results table and stop loading spinner
        toggleResultsTable('show');
        ladda.stop();
      } else {
        // Display possible errors
        displayErrorMessage(cb.message);

        // Stop loading spinner
        ladda.stop();
      }

      // If captcha is enabled
      if($('.captcha').length > 0){
        // Reset recaptcha
        grecaptcha.reset();
        disableInputs();
      }
    });
  });

  // Request lookup, when multi form is active
  $('.row').on('click', 'form.multi .submit', function(e){
    // Hide lookup results table and error container
    toggleResultsTable('hide');
    toggleErrorContainer('hide');

    // Create ladda (loading spinner) instance and start spinning
    var ladda = Ladda.create(this);
    ladda.start();

    submitMultiLookup(function(cb){
      if (cb.status === 'success') {
        // Populate result table with API response data
        populateResultTable(cb.data);

        // Show lookup results table and stop loading spinner
        toggleResultsTable('show');
        ladda.stop();
      } else {
        // Display possible errors
        displayErrorMessage(cb.message);

        // Stop loading spinner
        ladda.stop();
      }

      // If captcha is enabled
      if($('.captcha').length > 0){
        // Reset recaptcha
        grecaptcha.reset();
        disableInputs();
      }
    });
  });

  // Listen on each keypress in the domain input
  $('#your-domain').keyup(function() {
    var input = $('#your-domain').val();

    // Check if it contains a dot
    if (input.indexOf('.') > -1) {
      toggleMultiLookupForm('hide');
    } else {
      toggleMultiLookupForm('show');
    }
  }).keydown(function(event){
    if(event.keyCode == 13) {
      // Prevent form default action
      event.preventDefault();

      // Apparently, $.click still works on <a> with Bootstrap's 'disabled' class,
      // so we have do double check here, if someone hits enter (which triggers $.click)
      if ($('#your-domain').val().length !== 0) {
        // "Click" submit button
        $('.submit').click();
      }
    }
  });

  // Update fake "select" when user clicks on package in dropdown menu
  $('#dropdownmenu > li').click(function(e){
    e.preventDefault();

    var selectedDisplayName = $(this).text();
    var selectedTlds = $(this).data('tlds');
    $('#tld-display').text(selectedDisplayName);
  });

  // On click on table rows
  $('body').delegate('tbody tr','click',function(event){
    if ($(this).data('available') === 'available') {
      var $checkbox = $(this).find('input');

      // Toggle checkbox and hightlighting of current row
      if ($checkbox.prop('checked')) {
        $checkbox.click();
        $(this).removeClass('table-selected');
      } else {
        $checkbox.click();
        $(this).addClass('table-selected');
      }
    }
  });

  // Make sure to allow direct clicks on the checkbox
  $('body').delegate('tbody tr input','click',function(event){
    event.stopImmediatePropagation();
  });

  // Enable/disable purchase button
  $('body').delegate('input[type=checkbox]','change',function(event){
    if ($('input[type=checkbox]:checked').length > 0) {
      $('.purchase').addClass('enabled').removeClass('disabled');
    } else {
      $('.purchase').addClass('disabled').removeClass('enabled');
    }
  });

  // On click on purchase button
  $('body').delegate('.purchase','click',function(e){
    var domains = '';

    // Construct domain chain string
    $( "input[type=checkbox]:checked" ).each(function( index ) {
      domains = domains + $( this ).parent().parent().text() + ', ';
    });

    // URL encode the string
    var encodedDomains = encodeURIComponent(domains.slice(0,-2)),
        purchaseFormRedirect = $('.purchaseFormRedirect').val().replace(/%s/g, encodedDomains);

    // Open in new window
    window.open(purchaseFormRedirect, '_blank');
  });

  // Disable purchase button by default
  $('.purchase').addClass('disabled').removeClass('enabled');

  // If captcha is enabled
  if($('.captcha').length > 0){
    // Disable button
    disableInputs();
  }

  if (inIframe()) {
    $('.iweltBrand').addClass('hidden');
    $('body').removeClass('navbar-padding');
    $('nav').addClass('hidden');
  }

  // Turn select into a chosen search input
  $("select").chosen()
});
