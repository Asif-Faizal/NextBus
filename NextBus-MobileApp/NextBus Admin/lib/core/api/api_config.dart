import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:path_provider/path_provider.dart';
import '../error/exceptions.dart';
import 'enviorment_config.dart';

class ApiConfig {
  static final Map<String, String> _env = {};
  static bool _isLoaded = false;
  
  static Future<void> loadEnv() async {
    if (_isLoaded) return;
    
    try {
      // First try to load from assets
      final String content = await rootBundle.loadString('.env');
      _parseEnvContent(content);
      _isLoaded = true;
      debugPrint('Environment variables loaded successfully from assets');
    } catch (e) {
      debugPrint('Could not load .env from assets: $e');
      // Fallback to loading from application documents directory
      try {
        final directory = await getApplicationDocumentsDirectory();
        final file = File('${directory.path}/.env');
        if (await file.exists()) {
          final content = await file.readAsString();
          _parseEnvContent(content);
          _isLoaded = true;
          debugPrint('Environment variables loaded from documents directory');
        } else {
          throw const CacheException(
            message: 'No .env file found in documents directory',
            code: 'ENV_FILE_NOT_FOUND',
          );
        }
      } catch (e) {
        if (e is AppException) {
          rethrow;
        }
        throw UnknownException(
          message: 'Error loading .env file: $e',
          code: 'ENV_LOAD_ERROR',
        );
      }
    }
  }
  
  static void _parseEnvContent(String content) {
    try {
      final List<String> lines = content.split('\n');
      for (var line in lines) {
        if (line.trim().isNotEmpty && !line.startsWith('#')) {
          final parts = line.split('=');
          if (parts.length == 2) {
            _env[parts[0].trim()] = parts[1].trim();
          }
        }
      }
    } catch (e) {
      throw ValidationException(
        message: 'Error parsing .env content: $e',
        code: 'ENV_PARSE_ERROR',
      );
    }
  }

  static String get nextBusUrl {
    if (!_isLoaded) {
      throw const ValidationException(
        message: 'Environment not loaded',
        code: 'ENV_NOT_LOADED',
      );
    }
    
    final url = switch (EnvironmentConfig.environment) {
      Environment.development => _env['LOCAL_API_URL'],
      Environment.production => _env['PROD_API_URL'],
    };

    if (url == null || url.isEmpty) {
      throw const ValidationException(
        message: 'API URL not configured',
        code: 'API_URL_NOT_CONFIGURED',
      );
    }

    return url;
  }

  static String get encryptionKey {
    if (!_isLoaded) {
      throw const ValidationException(
        message: 'Environment not loaded',
        code: 'ENV_NOT_LOADED',
      );
    }
    
    final key = _env['ENCRYPTION_KEY'];
    if (key == null || key.isEmpty) {
      throw const ValidationException(
        message: 'Encryption key not configured',
        code: 'ENCRYPTION_KEY_NOT_CONFIGURED',
      );
    }

    return key;
  }
}
