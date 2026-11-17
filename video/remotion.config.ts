/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

// Production assets are referenced relative to ../productions (e.g. "<slug>/assets/x.jpg").
// Note: the whole folder is copied into each render bundle, so keep heavy raw media elsewhere.
Config.setPublicDir("../productions");
