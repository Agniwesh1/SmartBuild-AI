package com.smartbuildai.controller;
import com.smartbuildai.dto.*; import com.smartbuildai.service.FloorService;
import org.springframework.http.ResponseEntity; import org.springframework.web.bind.annotation.*; import java.util.List;
@RestController @RequestMapping("/api/floors")
public class FloorController { private final FloorService service; public FloorController(FloorService service){this.service=service;}
 @GetMapping("/house/{houseId}") public ResponseEntity<List<FloorResponseDTO>> list(@PathVariable Long houseId){return ResponseEntity.ok(service.list(houseId));}
 @PostMapping public ResponseEntity<FloorResponseDTO> create(@RequestBody FloorRequestDTO r){return ResponseEntity.ok(service.create(r));}
 @PutMapping("/{id}") public ResponseEntity<FloorResponseDTO> update(@PathVariable Long id,@RequestBody FloorRequestDTO r){return ResponseEntity.ok(service.update(id,r));}
 @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id){service.delete(id);return ResponseEntity.noContent().build();}
}
