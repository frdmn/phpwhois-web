<?php

/* General */

// Standard exception data
$jsonObject = array(
  'status' => 'success'
);

/* Routes */

/**
 * Route - "GET /"
 * @return void
 */
function dashboard() {
  global $templates;
  echo $templates->render('partials::dashboard');
}

/**
 * Route - "GET /api" - to display an API route overview
 * @return void
 */
function routeApiOverview() {
  global $jsonObject;

  // Create array with available routes
  $routes = array(
    'GET /api' => 'This API overview',
    'GET /api/tlds' => 'List all available TLDs',
    'GET /api/lookup/single/{domain}' => 'Whois a single domain',
    'POST /api/lookup/multi' => 'Whois multiple domain TLDs'
    );

  $jsonObject['data'] = $routes;

  echo json_encode($jsonObject);
}

/**
 * Route - "GET /api/tlds" - list all available TLDs
 * @return void
 */
function routeApiGetTlds() {
  global $jsonObject, $config;

  // Create array with available routes
  $jsonObject['data'] = $config->tlds;

  echo json_encode($jsonObject);
}

/**
 * Route - "GET /api/lookup/single/:domain" - Lookup a single domain
 * @return void
 */
function routeApiGetLookupSingle($request, $response, $args) {
  global $jsonObject;

  // Parse domain from request path
  $domain = $args['domain'];
  // Check if domain is registered
  $status = checkIfRegistered($domain);

  // Make sure there was no problem during the lookup
  if (!$status) {
    $jsonObject['status'] = 'error';
    $jsonObject['message'] = 'Problem while trying to lookup whois';
  }

  // Evaluate $status
  if ($status === 'yes') {
    $jsonObject['data']['registered'] = true;
  } elseif ($status === 'yes') {
    $jsonObject['data']['registered'] = false;
  } else {
    $jsonObject['data']['registered'] = $status;
  }

  echo json_encode($jsonObject);
}

/**
 * Route - "POST /api/lookup/multi" - Whois multiple domain TLDs
 * @return void
 */
function routeApiPostLookupMulti($request, $response, $args) {
  global $jsonObject;

  // Parse POST parameter
  $postBody = $request->getParsedBody();

  // Check for "domain"
  if (!$postBody['domain']) {
    $jsonObject['status'] = 'error';
    $jsonObject['message'] = 'Couldn\'t find \'domain\' parameter';
  }

  // and for "tlds"
  if (!$postBody['tlds']) {
    $jsonObject['status'] = 'error';
    $jsonObject['message'] = 'Couldn\'t find \'tlds\' parameter';
  }

  // Split by ","
  $tlds = explode(', ', $postBody['tlds']);
  $results = [];

  // Loop through each given TLD
  foreach ($tlds as $tld) {
    // Construct full domain with TLD suffix
    $domain = $postBody['domain'].'.'.$tld;
    // Check if domain is registered
    $status = checkIfRegistered($domain);
    $tldJsonObject = array();

    // Make sure there was no problem during the lookup
    if (!$status) {
      $tldJsonObject['status'] = 'error';
      $tldJsonObject['message'] = 'Problem while trying to lookup whois';
    } else {
      $tldJsonObject['status'] = 'success';
    }

    // Evaluate $status
    if ($status === 'yes') {
      $tldJsonObject['registered'] = true;
    } elseif ($status === 'yes') {
      $tldJsonObject['registered'] = false;
    } else {
      $tldJsonObject['registered'] = $status;
    }

    // Push $tldJsonObject into the $results array using the domain as key
    $results[$domain] = $tldJsonObject;
  }

  // Push results array into "data" JSON
  $jsonObject['data'] = $results;

  echo json_encode($jsonObject);
}
