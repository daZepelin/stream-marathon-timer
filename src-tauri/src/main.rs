#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// ignore unused variables
#![allow(unused_variables)]

use actix_cors::Cors;
use actix_web::{get, App, HttpResponse, HttpServer, Responder};
// use tauri::api::path;
use dirs::data_local_dir;

use std::fs;

fn read_data_file(filename: &str) -> Result<String, std::io::Error> {
    println!("Reading data file: {}, path: {}", filename, data_local_dir().unwrap().display());
    if let Some(mut data_path) = data_local_dir() {
        data_path.push(filename);  // Append the filename to the path
        fs::read_to_string(data_path)  // Use standard Rust's fs module to read the file to a String
    } else {
        Err(std::io::Error::new(std::io::ErrorKind::NotFound, "Data directory not found"))
    }
}

#[get("/time")]
async fn get_time() -> impl Responder {
    match read_data_file("subathon-timer-bot/subathon/time.txt") {
        Ok(time) => {
            println!("time: {}", time);
            return HttpResponse::Ok().body(time)
        },
        Err(_) => return HttpResponse::Ok().body("600"),
    }
}

#[get("/config")]
async fn get_config() -> impl Responder {
    HttpResponse::Ok().body("cfg")
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            tauri::async_runtime::spawn(
                HttpServer::new(|| {
                    let cors = Cors::default().allowed_origin("http://localhost:1424");

                    App::new().wrap(cors).service(get_time).service(get_config)
                })
                .bind(("127.0.0.1", 1425))?
                .run(),
            );
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
