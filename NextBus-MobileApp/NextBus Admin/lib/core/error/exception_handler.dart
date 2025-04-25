import 'dart:io';
import 'dart:convert';

import 'package:dartz/dartz.dart';
import 'package:http/http.dart';

import '../network/network_info.dart';
import 'failures.dart';

/// Helper class for repositories to handle common API call errors
class ExceptionHandler {
  final NetworkInfo networkInfo;

  ExceptionHandler(this.networkInfo);

  /// Executes API calls and handles common errors
  /// 
  /// Takes a function [apiCall] that returns a Future of type T
  /// Returns Either a Failure or the result of type T
  Future<Either<Failure, T>> handleApiCall<T>(
    Future<T> Function() apiCall,
  ) async {
    // First check network connectivity
    final networkResult = await networkInfo.isConnected();
    return networkResult.fold(
      (failure) => Left(failure),
      (isConnected) async {
        if (!isConnected) {
          return Left(NetworkFailure(
            message: 'No internet connection available',
            code: 'NO_INTERNET',
          ));
        }

        try {
          final result = await apiCall();
          return Right(result);
        } on SocketException {
          return Left(ServerFailure(
            message: 'Server is currently unavailable. Please try again later.',
            code: 'SERVER_UNAVAILABLE',
          ));
        } on ClientException catch (e) {
          if (e.toString().contains('Connection refused') || 
              e.toString().contains('Connection timed out')) {
            return Left(ServerFailure(
              message: 'Server is currently unavailable. Please try again later.',
              code: 'SERVER_UNAVAILABLE',
            ));
          }
          return Left(ServerFailure(
            message: 'Could not connect to server. Please check your connection.',
            code: 'SERVER_CONNECTION_ERROR',
          ));
        } on String catch (e) {
          // Handle API error responses (non-200 status codes)
          try {
            final jsonData = jsonDecode(e);
            if (jsonData is Map<String, dynamic> && jsonData.containsKey('message')) {
              return Left(AuthenticationFailure(
                message: jsonData['message'] as String,
                code: 'INVALID_CREDENTIALS',
              ));
            }
          } catch (_) {
            // If we can't parse the error as JSON, it's not an API error
          }
          return Left(UnknownFailure(
            message: 'An unexpected error occurred. Please try again later.',
            code: 'UNEXPECTED_ERROR',
          ));
        } on Exception catch (e) {
          // Handle other network/server errors
          if (e.toString().contains('SocketException') || 
              e.toString().contains('Connection refused') ||
              e.toString().contains('ClientException') ||
              e.toString().contains('Connection timed out')) {
            return Left(ServerFailure(
              message: 'Server is currently unavailable. Please try again later.',
              code: 'SERVER_UNAVAILABLE',
            ));
          }
          
          if (e.toString().contains('Network is unreachable') ||
              e.toString().contains('No address associated with hostname')) {
            return Left(NetworkFailure(
              message: 'Network connection unavailable. Please check your internet connection.',
              code: 'NETWORK_UNAVAILABLE',
            ));
          }

          return Left(UnknownFailure(
            message: 'An unexpected error occurred. Please try again later.',
            code: 'UNEXPECTED_ERROR',
          ));
        }
      },
    );
  }
} 