import AppKit
import Foundation
import Vision

if CommandLine.arguments.count < 2 {
    FileHandle.standardError.write("Usage: vision_ocr.swift <image-path>\n".data(using: .utf8)!)
    exit(2)
}

let imageURL = URL(fileURLWithPath: CommandLine.arguments[1])

guard let image = NSImage(contentsOf: imageURL) else {
    FileHandle.standardError.write("Unable to load image\n".data(using: .utf8)!)
    exit(3)
}

var rect = CGRect(origin: .zero, size: image.size)
guard let cgImage = image.cgImage(forProposedRect: &rect, context: nil, hints: nil) else {
    FileHandle.standardError.write("Unable to create CGImage\n".data(using: .utf8)!)
    exit(4)
}

var recognizedLines: [(CGRect, String)] = []
let request = VNRecognizeTextRequest { request, error in
    if let error = error {
        FileHandle.standardError.write("\(error.localizedDescription)\n".data(using: .utf8)!)
        return
    }

    let observations = request.results as? [VNRecognizedTextObservation] ?? []
    for observation in observations {
        if let candidate = observation.topCandidates(1).first {
            recognizedLines.append((observation.boundingBox, candidate.string))
        }
    }
}

request.recognitionLevel = .accurate
request.usesLanguageCorrection = true
request.recognitionLanguages = ["en-US"]

let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
try handler.perform([request])

let text = recognizedLines
    .sorted { lhs, rhs in
        if abs(lhs.0.midY - rhs.0.midY) > 0.01 {
            return lhs.0.midY > rhs.0.midY
        }
        return lhs.0.minX < rhs.0.minX
    }
    .map { $0.1 }
    .joined(separator: "\n")

print(text)
